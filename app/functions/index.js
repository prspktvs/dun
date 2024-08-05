const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {onValueWritten} = require("firebase-functions/v2/database");
const fetch = require('node-fetch');

const creds = require("./service-key.json");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(creds),
});

const API_HOST = process.env.FUNCTIONS_EMULATOR
  ? 'http://localhost:3000'
  : 'https://api.dun.wtf';

exports.onWrittenFunction = onValueWritten({
  ref: "/chats/{cardId}/messages/{messageId}",
  region: "europe-west1"
},
  (event) => {
    console.log('event', event)
    // Exit when the data is deleted.
    if (!event.data.after.exists()) {
      return null;
    }
    const msg = event.data.after.val();
    console.log('msg', msg, 'params', event.params);

    fetch(`${API_HOST}/internal/chat/${event.params.cardId}`, {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then(json => console.log(json));
  });

