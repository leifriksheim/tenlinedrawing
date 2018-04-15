const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tenlinedrawing.firebaseio.com"
});

const db = admin.database();

exports.onUsers = functions.database.ref("/users").onCreate(event => {
  const users = event.data.val();
  const numUsers = event.data.numChildren();
  const userArray = Object.keys(users);
  if (numUsers === 1) {
    db.ref("game/currentPlayer").set(userArray[0]);
    db.ref("game/count").set(0);
  }
});

exports.onUserSignOff = functions.database
  .ref("/users/{uid}")
  .onDelete(event => {
    const uid = event.params.uid;
    db.ref("game/currentPlayer").once("value", function(snapshot) {
      const currentPlayer = snapshot.val();
      if (currentPlayer === uid) {
        db.ref("users").once("value", function(snapshot) {
          const users = snapshot.val();
          const userIds = Object.keys(users);
          db.ref("game/currentPlayer").set(userIds[0]);
        });
      }
    });
  });
