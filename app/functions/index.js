const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {onValueWritten} = require("firebase-functions/v2/database");
const fetch = require('node-fetch');

const creds = require("./service-key.json");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(creds),
});

const isDev = Boolean(process.env.FUNCTIONS_EMULATOR)
const REGION = isDev ? 'us-central1' : 'europe-west1';
const API_HOST = isDev
  ? 'http://localhost:3000'
  : 'https://api.dun.wtf';

console.log('API_HOST', API_HOST, 'REGION', REGION);

exports.onWrittenFunction = onValueWritten({
  ref: "/chats/{chatId}/messages/{messageId}",
  region: REGION
},
  (event) => {
    console.log('event', event)
    // Exit when the data is deleted.
    if (!event.data.after.exists()) {
      return null;
    }

    const msg = event.data.after.val();
    console.log('msg', msg, 'params', event.params);
    const data = { ...msg, ...event.params };

    fetch(`${API_HOST}/internal/chat/${event.params.chatId}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then(json => console.log(json));
  });

