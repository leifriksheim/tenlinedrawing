const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tenlinedrawing.firebaseio.com"
});

const db = admin.database();

const setNextUser = uid => {
  db.ref("users").once("value", function(snapshot) {
    const users = snapshot.val();
    const numUsers = snapshot.numChildren();
    const userIds = Object.keys(users);
    const userIndex = userIds.findIndex(id => id === uid);
    if (userIndex + 1 === numUsers) {
      db.ref("game/currentPlayer").set(userIds[0]);
    } else {
      db.ref("game/currentPlayer").set(userIds[userIndex + 1]);
    }
  });
};

exports.onUserLogin = functions.database.ref("/users/{uid}").onCreate(event => {
  const uid = event.params.uid;
  db.ref("users").once("value", function(snapshot) {
    const users = snapshot.val();
    const numUsers = snapshot.numChildren();
    if (numUsers === 1) {
      db.ref("game/currentPlayer").set(uid);
      db.ref("game/count").set(0);
    }
  });
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

/*exports.onUserSubmit = functions.database
  .ref("/game/lastPlayer")
  .onWrite(event => {
    const lastPlayer = event.data.val();
    setNextUser(lastPlayer);
  });*/
