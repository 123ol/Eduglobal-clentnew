import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: "AIzaSyBi9_XAnFAZv9oCa7J7943AInNtiAEMuH8",
  authDomain: "t21-services-project.firebaseapp.com",
  projectId: "t21-services-project",
  storageBucket: "t21-services-project.firebasestorage.app",
  messagingSenderId: "816933869394",
  appId: "1:816933869394:web:851bd715bc44ecac40cc8b",
  measurementId: "G-6EV73FL8LV"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);