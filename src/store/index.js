import Vue from 'vue'
import Vuex from 'vuex'

import items from './store-items'
import words from './store-words'
import srs from './srs'

import auth from './store-auth.js'
// import { auth } from 'firebase'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

/* below is a test for google cloud functions */

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   console.log(original)
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   const snapshot = await admin.database().ref('/messages').push({original: original});
//   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//   res.redirect(303, snapshot.ref.toString());
// });


Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      auth,
      items,
      words,
      srs
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
