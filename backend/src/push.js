import webPush from "web-push";
import assert from "node:assert";

import { SAVE_PUSH_TOKEN, GET_PUSH_TOKENS, DELETE_PUSH_TOKEN, DELETE_PUSH_TOKEN_BY_ID } from "./database/queries.js";
import { allQuery, runQuery } from "./database/index.js";

assert(process.env.VAPID_PUBLIC_KEY, "VAPID_PUBLIC_KEY is required");
assert(process.env.VAPID_PRIVATE_KEY, "VAPID_PRIVATE_KEY is required");

webPush.setVapidDetails(
  "mailto:vlad@p11.co",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default function createPushAPI(app, route) {

  async function sendNotification(userId, payload) {
    console.log('sendNotification', userId, payload)
    const pushTokens = await allQuery(GET_PUSH_TOKENS, [userId]);
    await Promise.all(
      pushTokens.map(async (pushToken) => {
        const subscription = JSON.parse(pushToken.subscription);
        // console.log('pushToken', pushToken, 'subscription', subscription)
        await webPush.sendNotification(subscription, JSON.stringify(payload))
          .catch((error) => {
            console.error("Error", error);
            if (error.statusCode === 410) {
              console.log('delete push token', subscription.keys.auth)
              return runQuery(DELETE_PUSH_TOKEN_BY_ID, [subscription.keys.auth]);
            }
          });
      })

    ).catch((error) => {
      console.error("Error", error);
    })

  }

  app.get(route + "vapidPublicKey", function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  });

  app.post(route + "register", async function (req, res) {
    const { subscription } = req.body;
    const user = req.user;
    const subscriptionId = subscription.keys.auth;
    console.log('subscription', subscription)
    // save push token
    await runQuery(SAVE_PUSH_TOKEN, [subscriptionId, user.user_id, JSON.stringify(subscription)]);
    res.sendStatus(201);
  });

  app.post(route + "unregister", async function (req, res) {
    const { subscription } = req.body;
    const user = req.user;
    const subscriptionId = subscription.keys.auth;
    await runQuery(DELETE_PUSH_TOKEN, [user.user_id, subscriptionId]);
    res.sendStatus(201);
  })

  app.post(route + "patch-subscription", async function (req, res) {
    const { old, current } = req.body
    const subscriptionId = old.keys.auth;
    await runQuery(DELETE_PUSH_TOKEN_BY_ID, [subscriptionId]);
    await runQuery(SAVE_PUSH_TOKEN, [current.keys.auth, user.user_id, JSON.stringify(current)]);
    res.sendStatus(200);
  });

  app.post(route + "sendNotification", async function (req, res) {
    console.log('req.body', req.body)
    const userId = req.query.user
    const payload = req.body.payload;
    const data = await sendNotification(userId, JSON.stringify(payload))
    res.sendStatus(200);
    res.send(data)
  });

  return sendNotification
};