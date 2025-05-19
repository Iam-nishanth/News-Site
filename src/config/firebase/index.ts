import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: 'AIzaSyCEYcumtD6jzXrKkeiDf_BEAmJGdhDoaXs',

    authDomain: 'hard-yards-7b250.firebaseapp.com',

    projectId: 'hard-yards-7b250',

    storageBucket: 'hard-yards-7b250.firebasestorage.app/news-images',

    messagingSenderId: '697064521535',

    appId: '1:697064521535:web:72bed74fb254dbddeedd8a',

    measurementId: 'G-Y4NW5YRHKL'
};

export const app = initializeApp(firebaseConfig);
