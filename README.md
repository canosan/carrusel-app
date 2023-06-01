# Carrusel
<img src="https://raw.githubusercontent.com/canosan/carrusel-app/main/assets/icon.png" height="80" width="80" >

Una sencilla aplicación Android de mensajería instantánea hecha con React Native (Expo) y Firebase. Este proyecto fue creado como
trabajo final para el Ciclo Superior en Desarrollo de Aplicaciones Web. Podras encontrar más detalles en el documento [Memoria.pdf](https://github.com/canosan/blob/main/Memoria.pdf). 

## Comenzando

Siguiendo estas instrucciones tendrás una copia del proyecto corriendo sobre tu máquina, para desarrollar, probar o compilar la apliación. Mira las notas de despliegue para ver cómo desplegar la aplicación.

### Preparando el entorno

Para preparar todo lo necesario, en la raíz del repositorio ejecuta:

```
npm install
```

### Ejecutar un entorno de pruebas local y en vivo

En la misma raíz, ejecuta:

```
npm run start
```

Y en tu dispositivo Android, instala la app 'Expo' de tu tienda de aplicaciones preferida, y escanea el QR que devuelva la salida.

### Compilación

Para compilar la app, basta con ejecutar:

```
expo build:android
```

Y seguir los pasos indicados.

## Despliegue

Inserta la configuración de tu aplicación Firebase dentro de firebaseConfig en [firebase.js](https://github.com/canosan/carrusel-app/blob/main/firebase.js). 

Las reglas de seguridad de Firestore Database y Storage se pueden encontrar dentro de la carpeta [firebase](https://github.com/canosan/carrusel-app/tree/main/firebase).

