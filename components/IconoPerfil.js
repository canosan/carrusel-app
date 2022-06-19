import { View } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Context from "../context/Context";
import Avatar from './Avatar';
import { auth } from '../firebase';

export default function IconoPerfil() {

  const navigation = useNavigation();
  const { theme: { colors }} = useContext(Context);
  const user = auth.currentUser;
  
  return (
    <View>
      <TouchableOpacity
        style={{
          marginRight: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          navigation.navigate("perfil", {})
        }}
      >
      <Avatar user={user} size={35}></Avatar>
      </TouchableOpacity>
      
    </View>
  )
}