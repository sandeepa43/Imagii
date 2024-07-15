// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
const firebaseConfig = {
    apiKey: Platform.select({
        ios: "AIzaSyCP5ooO4IPvG4_qYvhgykb6gaiq1YPkgt8",
        android: "AIzaSyA6cuXL9W_EaHtDSU4YlR5wWBCllz78fSw",
    }),
    authDomain: "imagestock-1877b.firebaseapp.com",
    projectId: "imagestock-1877b",
    storageBucket: "imagestock-1877b.appspot.com",
    messagingSenderId: "136922478401",
    appId: Platform.select({
        ios: "1:136922478401:ios:a4a5ee36fd86cd47dd93c0",
        android: "1:136922478401:android:c328425c7dfd24f7dd93c0",
    }),
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
