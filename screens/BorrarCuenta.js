import { View, Text, Button, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { Col, Row } from 'react-native-easy-grid';
import { auth, db, signIn } from '../firebase';
import GlobalContext from '../context/Context';
import { TextInput } from 'react-native-gesture-handler';
import { deleteDoc, doc } from 'firebase/firestore';
import * as Updates from 'expo-updates';

export default function BorrarCuenta() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const user = auth.currentUser;

    async function reloadApp () {
        await Updates.reloadAsync();
    }
    
  const { theme: { colors, perfil } } = useContext(GlobalContext);

    async function handleDeleteProfile(){

        if( password.length < 1 || password !== confirmPassword){
            Alert.alert(
                "Error",
                "Verifique que ha escrito bien su contraseña en ambos campos.",
                [
                  { text: "Aceptar", onPress: () => {} }
                ]
            );
        }

        else {
                if(await signIn(user.email, password).catch((e) => {
                    Alert.alert(
                        "Error",
                        e.message,
                        [
                          { text: "Aceptar", onPress: () => {} }
                        ]
                    );
                })){
                    user.delete()
                    deleteDoc(doc(db, "usuarios", user.uid));
                    reloadApp();
                }
                else{
                    Alert.alert(
                        "Error",
                        "La contraseña no es correcta.",
                        [
                          { text: "Aceptar", onPress: () => {} }
                        ]
                    );
                }
            }

    }

    return (
        <React.Fragment>

        <View
            style={ perfil }
        >
            <Row>
                <Col>
                    <Text style={{ fontSize: 22, color: colors.foreground }}>Borrar Cuenta de Usuario</Text>
                    <Text style={{ fontSize: 14, color: colors.text, marginTop: 10 }}>
                        Confirme su contraseña para continuar.
                    </Text>
                    
                    <TextInput
                    secureTextEntry={ true }
                    placeholder="contraseña"
                    value={password}
                    onChangeText={setPassword}
                    style={{
                        borderBottomColor: colors.primary,
                        marginTop: 40,
                        borderBottomWidth: 2,
                        width: "100%",
                    }}
                    />
                    <TextInput
                    secureTextEntry={ true }
                    placeholder="repita su contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={{
                        borderBottomColor: colors.primary,
                        marginTop: 40,
                        borderBottomWidth: 2,
                        width: "100%",
                    }}
                    />
                </Col>
            </Row>
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
        </View>
        </React.Fragment>
    );
}