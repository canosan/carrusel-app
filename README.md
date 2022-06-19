# carrusel-app
<img src="[http://url.to/image.png](https://github.com/canosan/carrusel-app/blob/main/assets/icon.png?raw=true)" height="60" width="60" >
A simple chat app made with React Native (Expo) and Firebase

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Preparing the dev environment

```
npm install
```

### Run a local live testing environment

On your dev machine, run:

```
npm run start
```

And on your android device, install the Expo app from your favorite store and scan the QR output by the previous command.

### Building

To build a binary, run:

```
expo build:android
```

## Deployment

Insert your Firebase app's config inside firebaseConfig in [firestore.js](https://github.com/canosan/carrusel-app/blob/main/firebase.js). 

