import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import Context from "../context/Context";
import { View } from "react-native";
import { pickImage } from "../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Foto(){
  const { theme: { colors }} = useContext(Context);
  const navigation = useNavigation();
  const [cancelled, setCancelled] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const result = await pickImage();
      navigation.navigate("contactos", { image: result });
      if (result.cancelled) {
        setCancelled(true);
        setTimeout(() => navigation.navigate("chats"), 100);
      }
    });
    return () => unsubscribe()
  }, [navigation, cancelled]);

  return (
    <View
      style={{ 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "black"
      }}
    >
      <MaterialCommunityIcons name="camera" size={80} color={colors.iconGray} />
    </View>
  );
}
