import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import GlobalContext from "../context/Context";
import Avatar from "./Avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function CabeceraChat() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme: { colors } } = useContext(GlobalContext);

  const user = route.params.user;
  const room = route.params.room;

  
  
  async function DeleteChat(){
    
    Alert.alert(
      "Borrar",
      "¿Borrar esta conversación?",
      [
        { text: "Cancelar", onPress: () => {} },
        { text: "Aceptar", onPress: async () => {
            await deleteDoc(doc(db, "salas", room.rid));
            navigation.navigate("feed");
        } }
      ]
    )

  }

  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
        <TouchableOpacity
          onPress={ () => navigation.navigate("infoUsuario", { user: user }) }
          style={{ flexDirection: "row", }}
        >
          
          <View>
            <Avatar size={40} user={route.params.user} />
          </View>
          
          <View
            style={{
              marginLeft: 15,
              alignItems: "center",
              justifyContent: "center",
              width: '70%'
            }}
          >
            <Text style={{ color: colors.white, fontSize: 18, fontWeight: "bold", width: '100%' }}>
            {route.params.user.nombreContacto || route.params.user.displayName}
          </Text>
          </View>
          
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            marginTop: 5,
            justifyContent:"flex-end",
            position: "relative",
            zIndex: 9999,
            marginLeft: "10%"
          }}
          onPress={() => {
            DeleteChat();
          }}
          >
          <MaterialCommunityIcons
            name="delete"
            size={30}
            style={{ color: "white" }}
            />
        </TouchableOpacity>
    </View>
  );
}


