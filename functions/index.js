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
    const userIndex = Object.keys(users).findIndex(id => id === uid);
    const userArray = Object.keys(users).map(id => users[id]);

    const nextUser = userArray.reduce(
      (acc, user, index) => {
        if (!user.online || user.uid === uid) {
          return acc;
        }
        const isAfterUser = index > userIndex ? true : false;
        const lastDistance = Math.abs(userIndex - acc.index);
        const currDistance = Math.abs(userIndex - index);
        if (isAfterUser && currDistance >= lastDistance) {
          return { uid: user.uid, index: index };
        }
        if (!isAfterUser && currDistance <= lastDistance) {
          return { uid: user.uid, index: index };
        }
      },
      { uid: "", index: 0 }
    );
    db.ref("game/currentPlayer").set(nextUser.uid);
  });
};

exports.onUserSignOff = functions.database
  .ref("/users/{uid}/online")
  .onWrite(event => {
    const uid = event.params.uid;
    const isOnline = event.data.val();
    const currentPlayerRef = db.ref("game/currentPlayer");

    // If currentPlayer logs off
    if (!isOnline) {
      currentPlayerRef.once("value", function(snapshot) {
        const currentPlayer = snapshot.val();
        if (currentPlayer === uid) {
          setNextUser(uid);
        }
      });
      // If first user logs on
    } else {
      db
        .ref("users")
        .orderByChild("online")
        .equalTo(true)
        .once("value", function(snapshot) {
          const users = snapshot.val();
          const numUsers = snapshot.numChildren();
          if (numUsers === 1) {
            currentPlayerRef.set(uid);
          }
        });
    }
  });

exports.onUserSubmit = functions.database
  .ref("/game/lastPlayer")
  .onWrite(event => {
    const lastPlayer = event.data.val();
    setNextUser(lastPlayer);
  });

// If first person has drawn and second user logs in
exports.onUsers = functions.database
  .ref("/users")
  .orderByChild("online")
  .equalTo(true)
  .onWrite(event => {
    const users = event.data.val();
    const numOfUsers = event.data.numChildren();
  });
