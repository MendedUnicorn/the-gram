// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC7zanT3Ws_UEUm6xTtFmG8jc9BnAaSd7Q',
  authDomain: 'the-gram-a229d.firebaseapp.com',
  projectId: 'the-gram-a229d',
  storageBucket: 'the-gram-a229d.appspot.com',
  messagingSenderId: '641480847770',
  appId: '1:641480847770:web:099dfce66bbc3339044a23',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage, db };
