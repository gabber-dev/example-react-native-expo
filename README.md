# React Native Expo Example App

## Running the App

This app uses custom native code via the (react-native-webrtc)[https://github.com/expo/config-plugins/tree/main/packages/react-native-webrtc] plugin and therefore it is not compitble with the Expo Go app.

In order to run this example, you'll need to use `expo-dev-client`.

First install expo-dev-client:
```bash
npx expo install expo-dev-client
```

Next install dependencies:
```bash
npm install
```

Run the app:
```bash
npx expo run:android
npx expo run:ios
```

## Running a Server

This app makes use of the (example-server)[https://github.com/gabber-dev/example-server] server. The server runs on port 4000 and is required to be running locally to connect start a realtime session via this app.
