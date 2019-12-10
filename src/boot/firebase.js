// import something here


// "async" is optional
export default async ({ /* app, router, Vue, ... */ }) => {
  // something to do
}

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app"
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics"
// Add the Firebase products that you want to use
import "firebase/auth"

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBqQdmGddrp-Hp2FWx6mjJ8xDs-WmNKcLM",
  authDomain: "solv-quasar-french.firebaseapp.com",
  databaseURL: "https://solv-quasar-french.firebaseio.com",
  projectId: "solv-quasar-french",
  storageBucket: "solv-quasar-french.appspot.com",
  messagingSenderId: "184938957676",
  appId: "1:184938957676:web:f510e57a0c7fd5e45d8149",
  measurementId: "G-BMPVXGLTBS"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig)

let firebaseAuth = firebaseApp.auth()

export { firebaseAuth }

firebase.analytics();