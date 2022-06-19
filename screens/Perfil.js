import React, { useContext, useState } from "react";
import { View, TouchableOpacity, Image, TextInput, Button, ToastAndroid, Alert } from "react-native";
import GlobalContext from "../context/Context";
import { pickImage, uploadImage } from "../utils";
import { auth, db } from "../firebase";
import { updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Col, Row } from "react-native-easy-grid";
import * as Updates from 'expo-updates';


export default function CrearPerfil() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [selectedImage, setSelectedImage] = useState(user.photoURL);
  const navigation = useNavigation();

  const { theme: { colors, perfil } } = useContext(GlobalContext);

  async function reloadApp () {
      await Updates.reloadAsync();
  }

  async function handleLogOut(){
    Alert.alert(
      "Cerrar sesión",
      "Se va a cerrar su sesión en la aplicación. Deberá volver a introducir sus credenciales.",
      [
        { text: "Cancelar", onPress: () => {} },
        { text: "Aceptar", onPress: async () => {
            await auth.signOut();
            reloadApp();
        } }
      ]
    )
  }

  async function handleDeleteProfile(){
    Alert.alert(
      "ATENCIÓN",
      "Está a punto de borrar su cuenta de usuario. Esta acción es irreversible. ¿Continuar de todos modos?",
      [
        { text: "Cancelar", onPress: () => {} },
        { text: "Borrar", onPress: () => {
          navigation.navigate("borrarCuenta");
        } }
      ]
    )
  }

  async function handlePress() {
    
    let userData;
    let photoURL;

    if (selectedImage) {
      const { url } = await uploadImage(
        selectedImage,
        `images/${user.uid}`,
        "pfp"
      );
      photoURL = url;
    }

    if(user.photoURL){

      userData = {
        displayName: displayName,
        email: email,
        photoURL: photoURL
      };

    }
    else{
      userData = {
        displayName: displayName,
        email: email,
      };
    }

    if (photoURL) {
      userData.photoURL = photoURL;
    }


    await Promise.all([
      updateProfile(user, userData),
      setDoc(doc(db, "usuarios", user.uid), { ...userData, uid: user.uid }),
    ]);
    ToastAndroid.show("Perfil actualizado", 50);
  }

  async function handleFotoDePerfil() {
    const result = await pickImage();
    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  }
  
  return (
    <React.Fragment>

      <View
        style={ perfil }
      >
        
        <Row
          style={{
            maxHeight: 200
          }}
        >
          <Col
            style={{ width: "40%" }}
          >
            <TouchableOpacity
              onPress={handleFotoDePerfil}
              style={{
                marginTop: 30,
                borderRadius: 120,
                width: 120,
                height: 120,
                backgroundColor: colors.background,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!selectedImage ? (
                <Image
                  source={ require("../assets/avatar.png") }
                  style={{
                    borderRadius: 120,
                    width: 120,
                    height: 120,
                  }}
                />
              ) : (
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    borderRadius: 120,
                    width: 120,
                    height: 120,
                  }}
                />
              )}
            </TouchableOpacity>
          </Col>

          <Col>
            <TextInput
              placeholder="nombre de usuario"
              value={displayName}
              onChangeText={setDisplayName}
              style={{
                borderBottomColor: colors.primary,
                marginTop: 45,
                borderBottomWidth: 2,
                width: "100%",
                fontSize: 24,
                fontWeight: "bold",
              }}
            />
            <TouchableOpacity
              onPress={ () => {
                ToastAndroid.show("Por motivos de seguridad, la edición del email no está permitida.", 50)
              }}
            >
              <TextInput
                editable={false}
                placeholder="email de usuario"
                value={email}
                style={{
                  borderBottomColor: colors.iconGray,
                  marginTop: 10,
                  borderBottomWidth: 2,
                  width: "100%",
                }}
              />
            </TouchableOpacity>
            
          </Col>
        </Row>

        <Row
          style={{
            maxHeight: 60
          }}
        >
          <Col
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%"
            }}
          >
            <View style={{ width: 160 }}>
              <Button
                title="Guardar cambios"
                color={colors.secondary}
                onPress={handlePress}
                disabled={(displayName.length < 1) || (displayName === user.displayName) && (email === user.email) && (selectedImage === user.photoURL)}
              />
            </View>
          </Col>
        </Row>

        <Row
          style={{
            display: "flex",
            alignItems: "flex-end"
          }}
        >
          <Col
            style={{
              alignItems: "center",
              width: "100%"
            }}
          >
            <View style={{ width: "100%" }}>
              <Button
                title="Cerrar sesión"
                color={colors.primary}
                onPress={handleLogOut}
                style={{
                  height: 100
                }}
              />
            </View>
            <View style={{ width: "100%",marginTop: 15 }}>
              <Button
                title="Borrar cuenta"
                color={colors.danger}
                onPress={handleDeleteProfile}
                style={{
                  color: "red",
                }}
              ></Button>
            </View>
          </Col>
        </Row>
        
      </View>
      </React.Fragment>
  );
}
