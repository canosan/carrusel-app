import "react-native-get-random-values";
import * as ImagePicker from "expo-image-picker";
import { nanoid }from 'nanoid'
import { storage } from "./firebase"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function pickImage() {
  let result = ImagePicker.launchCameraAsync();
  return result;
}

export async function askForPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status;
}

export async function uploadImage(uri, path, fName) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileName = fName || nanoid();
  const imageRef = ref(storage, `${path}/${fileName}.jpeg`);

  const snapshot = await uploadBytes(imageRef, blob, {
    contentType: "image/jpeg",
  });

  blob.close();

  const url = await getDownloadURL(snapshot.ref);

  return { url, fileName };
}
  
export const theme = {
  colors: {
    background: "#cbdde8",
    foreground: "#25598a",
    primary: "#4484c6",
    tertiary: "#a6c6fa",
    secondary: "#2566d7",
    white: "white",
    text: "#3C3C3C",
    secondaryText: "#707070",
    danger: "#d42434",
    lightGray: "#b3b3b3",
    iconGray: "#626262",
  },
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
  },
  perfil: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      padding: 40
  },
};
