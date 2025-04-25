import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
    projectId: "stock-liv-2024",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_BUCKET_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);