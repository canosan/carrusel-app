import { View, Text, Image, Button, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import GlobalContext from '../context/Context'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { signUp, signIn } from '../firebase';
import { useRoute } from '@react-navigation/native';

export default function Acceder() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("signUp");
  const { theme: { colors, container } } = useContext(GlobalContext);
  const route = useRoute();

  async function handlePress(){
    if(mode === 'signUp'){
      if(password.length < 6){
        Alert.alert(
          "Error al registrarte",
          "La contraseña debe de contener al menos 6 caracteres.",
          [
            { text: "Aceptar", onPress: () => {} }
          ]
        );
      }
      if(password !== confirmPassword){
        Alert.alert(
          "Error al registrarte",
          "Verifique que ha escrito bien su contraseña en ambos campos.",
          [
            { text: "Aceptar", onPress: () => {} }
          ]
        );
      }
      else await signUp(email, password).catch((error) => {
        Alert.alert(
          "Error al registrarte",
          "Es posible que ese usuario ya esté registrado.",
          [
            { text: "Aceptar", onPress: () => {} }
          ]
        )
      });

    }if(mode === 'signIn'){
      await signIn(email, password).catch((error) => {
        Alert.alert(
          "Error",
          error.message,
          [
            { text: "Aceptar", onPress: () => {} }
          ]
          );
      });
    }
  }

  return (
    <View style={ container }>
      <Text style={{
          color: colors.foreground,
          fontSize: 24,
          marginBottom: 20,
        }}
      >Bienvenido a Carrusel</Text>
      <Image 
        source={ require('../assets/icono-acceder.png') }
        style={{
          width: 300,
          height: 300,
        }}
        resizeMode="cover"
      />
      <View style={{ marginTop: 20 }} >
        <TextInput
          placeholder='email'
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            width: 230,
          }}
          value={ email }
          onChangeText={ setEmail }
        />
        <TextInput
          secureTextEntry={ true }
          placeholder='contraseña'
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            width: 230,
            marginTop: 20,
          }}
          value={ password }
          onChangeText={ setPassword }
        />
        { mode === 'signUp' &&
        
          <TextInput
          secureTextEntry={ true }
          placeholder='repita su contraseña'
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            width: 230,
            marginTop: 5,
          }}
          value={ confirmPassword }
          onChangeText={ setConfirmPassword }
          />

        }
        
        <View style={{ marginTop: 20, }}>
          <Button
            title={mode === 'signUp' ? 'Registrarse' : 'Entrar' }
            disabled={ !password || !email }
            color={colors.secondary}
            onPress={ handlePress }
          />
        </View>

        <TouchableOpacity style={{ marginTop: 20 }} onPress={ () => mode=== 'signUp' ? setMode('signIn') : setMode('signUp') }>
          <Text>{ mode === 'signUp' ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Registrate' }</Text>
        </TouchableOpacity>

      </View>

    </View>
  )
}