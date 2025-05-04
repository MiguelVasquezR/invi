import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDzolOGo3s8KWBaj_hZpB_QqD3DrW3YgpE",
  authDomain: "musicografia-d6323.firebaseapp.com",
  databaseURL: "https://musicografia-d6323-default-rtdb.firebaseio.com",
  projectId: "musicografia-d6323",
  storageBucket: "musicografia-d6323.firebasestorage.app",
  messagingSenderId: "560702952998",
  appId: "1:560702952998:web:555cb5eefc418c7fc078e7",
};

const app = initializeApp(firebaseConfig);

export default app;
