// Install firebase dependencies: expo install firebase
// Sonny Sangha Signal Clone -install firebase: https://youtu.be/MJzmZ9qmdaE?t=4059

// To fix Cannot read property 'length' of undefined in react-native when running for web:
// https://stackoverflow.com/a/68226205
import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAar-m9GFMBDO1uMHTBxiwmLbj5i1lNg_E",
    authDomain: "react-native-8bfa7.firebaseapp.com",
    projectId: "react-native-8bfa7",
    storageBucket: "react-native-8bfa7.appspot.com",
    messagingSenderId: "199437012952",
    appId: "1:199437012952:web:1eef78fb7f29689966acad",
    measurementId: "G-K26F8VVVKR"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const dbStorage = app.storage();
const auth = firebase.auth();
const dbFieldValue = firebase.firestore.FieldValue;
export { db, dbStorage, auth, dbFieldValue };