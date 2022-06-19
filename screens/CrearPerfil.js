import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Button } from "react-native";
import GlobalContext from "../context/Context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { pickImage, askForPermission, uploadImage } from "../utils";
import { auth, db } from "../firebase";
import { updateProfile } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";

export default function CrearPerfil() {
  const [displayName, setDisplayName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {(async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);

  const { theme: { colors, perfil } } = useContext(GlobalContext);

  async function handlePress() {
    const user = auth.currentUser;
    let photoURL;
    if (selectedImage) {
      const { url } = await uploadImage(
        selectedImage,
        `images/${user.uid}`,
        "pfp"
      );
      photoURL = url;
    }
    const userData = {
      displayName,
      email: user.email,
    };
    if (photoURL) {
      userData.photoURL = photoURL;
    }

    await Promise.all([
      updateProfile(user, userData),
      setDoc(doc(db, "usuarios", user.uid), { ...userData, uid: user.uid }),
    ]);
    navigation.navigate("feed");
  }

  async function handleFotoDePerfil() {
    const result = await pickImage();
    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  }

  if (permissionStatus !== "granted") {
    return <Text>Debes conceder los permisos necesarios para que la aplicación funcione correctamente.</Text>;
  }
  
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <View
        style={ perfil }
      >
        <Text style={{ fontSize: 22, color: colors.foreground }}>Info. del Perfil</Text>
        <Text style={{ fontSize: 14, color: colors.text, marginTop: 20 }}>
          Introduzca su nombre y seleccione (si lo desea) una foto de perfil. Esta foto será la que se le muestre a sus contactos.
        </Text>
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
            <MaterialCommunityIcons
              name="camera-plus"
              color={colors.iconGray}
              size={45}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "100%", borderRadius: 120 }}
            />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Escriba su nombre"
          value={displayName}
          onChangeText={setDisplayName}
          style={{
            borderBottomColor: colors.primary,
            marginTop: 40,
            borderBottomWidth: 2,
            width: "100%",
          }}
        />
        <View style={{ marginTop: "auto", width: 110 }}>
          <Button
            title="Continuar"
            color={colors.secondary}
            onPress={handlePress}
            disabled={!displayName}
          />
        </View>
      </View>
    </React.Fragment>
  );
}
