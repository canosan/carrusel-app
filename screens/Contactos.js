import { collection, query, where, onSnapshot } from "@firebase/firestore";
import { useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import ElementoLista from "../components/ElementoLista";
import GlobalContext from "../context/Context";
import { db } from "../firebase";
import useContactos from "../hooks/useHooks";

export default function Contactos() {
  const contacts = useContactos();
  const route = useRoute();
  const image = route.params && route.params.image;
  
  return (
    <FlatList
      style={{ flex: 1, padding: 10 }}
      data={contacts}
      keyExtractor={(_, i) => i}
      renderItem={({ item }) => <PreviewContact contact={item} image={image} />}
    />
  );
}

function PreviewContact({ contact, image }) {
  const { unfilteredRooms, rooms } = useContext(GlobalContext);
  const [user, setUser] = useState(contact);

  let ur = unfilteredRooms.find((room) => room.listaParticipantes.includes(contact.email));
  if(ur === undefined){
    ur = false;
  }

  useEffect(() => {
    const q = query(
      collection(db, "usuarios"),
      where("email", "==", contact.email)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length) {
        const userDoc = snapshot.docs[0].data();
        setUser((prevUser) => ({ ...prevUser, uid: userDoc.uid, displayName: userDoc.displayName, email: userDoc.email, photoURL: userDoc.photoURL }));
      }
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <ElementoLista
      type="contactos"
      image={image}
      user={user}
      room={ur}
      style={{ marginTop: 7 }}
    />
  );
}
