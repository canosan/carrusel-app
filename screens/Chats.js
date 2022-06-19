import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useContext, useEffect } from "react";
import { View, Text } from "react-native";
import Context from "../context/Context";
import GlobalContext from "../context/Context";
import { auth, db } from "../firebase";
import IconoFlotanteContactos from "../components/IconoFlotanteContactos";
import ElementoLista from "../components/ElementoLista";
import useContactos from "../hooks/useHooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Chats() {
  const { currentUser } = auth;
  const { rooms, setRooms, setUnfilteredRooms } = useContext(GlobalContext);
  const contacts = useContactos();

  const { theme: { colors }} = useContext(Context);

  const chatsQuery = query(
    collection(db, "salas"),
    where("listaParticipantes", "array-contains", currentUser.email)
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userB: doc
          .data()
          .participantes.find((p) => p.email !== currentUser.email),
      }));
      setUnfilteredRooms(parsedChats);
      setRooms(parsedChats.filter((doc) => doc.lastMessage));
    });
    return () => unsubscribe();
  }, []);

  function getUserB(user, contacts) {
    const contactoUsuario = contacts.find((c) => c.email === user.email);
    if (contactoUsuario && contactoUsuario.nombreContacto) {
      return { ...user, nombreContacto: contactoUsuario.nombreContacto };
    }
    return user;
  }
  
  return (
    <View style={{ flex: 1, padding: 5, paddingRight: 10 }}>
      {(rooms.length < 1) ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
          }}
        >
          <MaterialCommunityIcons
            name="message-text"
            size={120}
            style={{
              color: colors.lightGray,
            }}
          />
          <Text
            style={{
              color: colors.lightGray
            }}
          >No tienes ningún chat abierto</Text>
        </View>
      ) : null}
      {rooms.sort((a,b) => {return b.lastMessage.createdAt - a.lastMessage.createdAt})
            .map((room) => (
              <ElementoLista
                type="chat"
                description={room.lastMessage.text}
                key={room.id}
                room={room}
                time={room.lastMessage.createdAt}
                user={getUserB(room.userB, contacts)}
              />
          ))
      }
      <IconoFlotanteContactos />
    </View>
  );
}
