import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "fb-socialmediaapp.firebaseapp.com",
  projectId: "fb-socialmediaapp",
  storageBucket: "fb-socialmediaapp.appspot.com",
  messagingSenderId: "15970413851",
  appId: "1:15970413851:web:4a9879ba06685c79dbb7be",
  databaseURL: "http://fb-socialmediaapp.firebaseio.com",
};

export const storageNames = {
  chatAppImages_ChatImages: "chatApp-images/chat-images/",
  chatAppImages_Avatar: "chatApp-images/avatar/",
};

export const collectionNames = {
  chatApp: "chatApp",
  messages: "messages",
  lastMsg: "lastMsg",
  chat : "chat",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const collectionRef = collection(db, `${collectionNames.chatApp}`);
export const storage = getStorage(app);


