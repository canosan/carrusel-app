import { useEffect, useState } from "react";
import * as Contactos from "expo-contacts";

export default function useContactos() {
  const [contactos, setContactos] = useState([]);
  useEffect(() => {
    (async () => {
      const { status } = await Contactos.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contactos.getContactsAsync({
          fields: [Contactos.Fields.Emails],
        });
        if (data.length > 0) {
          setContactos(
            data.filter((c) => c.firstName && c.emails && c.emails[0] && c.emails[0].email)
                .map(mapContactToUser)
          );
        }
      }
    })();
  }, []);
  return contactos;
}
function mapContactToUser(contact) {
  return {
    nombreContacto:
      contact.firstName && contact.lastName
        ? `${contact.firstName} ${contact.lastName}`
        : contact.firstName,
    email: contact.emails[0].email,
  };
}
