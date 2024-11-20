// Import the functions you need from the SDKs you need

//here you must add your configs form Firebase website :https://firebase.google.com/

import { initializeApp } from "firebase/app";
import 'firebase/auth'
// Import the functions you need from the SDKs you need


//copy and Paste
const firebaseConfig = {
  //config
  apiKey: "AIzaSyChVDf3D0CiiSl79mjOdvgapMDh-OmAq3w",
  authDomain: "testproject-207b2.firebaseapp.com",
  projectId: "testproject-207b2",
  storageBucket: "testproject-207b2.appspot.com",
  messagingSenderId: "375356060785",
  appId: "1:375356060785:web:de5507dec14fd70840d7d0",
  measurementId: "G-S1B3FE2WZM"
};


//IT MUST BE LIKE THIS  DONT CHANGE IT
const app = initializeApp(firebaseConfig);
export {app}