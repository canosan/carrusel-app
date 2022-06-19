import React, { useState, useEffect, useContext, LogBox } from "react";
import { StatusBar } from "react-native";
import { useAssets } from "expo-asset";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Acceder from "./screens/Acceder";
import ContextWrapper from "./context/ContextWrapper";
import Context from "./context/Context";
import CrearPerfil from "./screens/CrearPerfil";
import Chats from "./screens/Chats";
import Foto from "./screens/Foto";
import Contactos from "./screens/Contactos";
import Chat from "./screens/Chat";
import CabeceraChat from "./components/CabeceraChat"
import InfoUsuario from "./screens/InfoUsuario";
import IconoPerfil from "./components/IconoPerfil";
import Perfil from './screens/Perfil';
import BorrarCuenta from "./screens/BorrarCuenta";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Descomenta esto si no te quieres volver loco viendo como te salta el mismo aviso a cada cosa que hagas

/* LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  "Setting a timer for a long period of time",
]); */

function App() {
  const [currUser, setCurrUser] = useState(null);
  const { theme: { colors }} = useContext(Context);
  StatusBar.setBarStyle('light-content', true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {!currUser ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="acceder" component={Acceder} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.foreground,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTintColor: colors.white,
          }}
        >
          {!currUser.displayName && (
            <Stack.Screen
              name="crearPerfil"
              component={CrearPerfil}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="feed"
            options={{ 
              title: "Carrusel",
              headerTitleStyle: {fontWeight: "bold"},
              headerRight: () => (
                <IconoPerfil />
              ),
              headerBackVisible: false }}
            component={Feed}
          />
          <Stack.Screen
            name="contactos"
            options={{ title: "Seleccionar Contacto" }}
            component={Contactos}
          />
          <Stack.Screen
            name="chat"
            component={Chat}
            options={{
              headerTitle: (props) => <CabeceraChat {...props} />
            }}
            />
          <Stack.Screen
            name="infoUsuario"
            options={{ title: "Perfil del usuario" }}
            component={InfoUsuario}
          />
          <Stack.Screen
            name="perfil"
            options={{ title: "Ajustes del Perfil" }}
            component={Perfil}
          />
          <Stack.Screen
            name="borrarCuenta"
            options={{ title: "Borrar Cuenta" }}
            component={BorrarCuenta}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
function Feed() {

  const {theme: {colors}} = useContext(Context);

  return (
    <Tab.Navigator
      screenOptions={{ tabBarStyle: {display: 'none'} }}
      initialRouteName="chats"
    >
      <Tab.Screen name="foto" component={Foto} />
      <Tab.Screen name="chats" component={Chats} />
    </Tab.Navigator>
  );
}

function Main() {
  const [assets] = useAssets(
    require("./assets/avatar.png"),
    require("./assets/fondo-chat.png"),
    require("./assets/icono-acceder.png")
  );

  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );

}

export default Main;
