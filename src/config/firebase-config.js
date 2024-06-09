// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDILxXg5y-YJb4sMooGp5Wk7U5yw80f8M0',
    authDomain: 'plantix-application-55118.firebaseapp.com',
    projectId: 'plantix-application-55118',
    storageBucket: 'plantix-application-55118.appspot.com',
    messagingSenderId: '193612798343',
    appId: '1:193612798343:web:a61ff8ea47533e170d5b22',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
