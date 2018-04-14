import Firebase from "firebase";
import "babel-polyfill";

const app = Firebase.initializeApp({
  apiKey: "AIzaSyBGkZaPtQl1vjoZQQrlWdrVGsVrtnI2u4k",
  authDomain: "tenlinedrawing.firebaseapp.com",
  databaseURL: "https://tenlinedrawing.firebaseio.com",
  projectId: "tenlinedrawing",
  storageBucket: "",
  messagingSenderId: "369445728737"
});

const auth = app.auth();
const db = app.database();
const game = db.ref("game");
const users = db.ref("users");

const getNextUserId = async uid => {
  const users = await db
    .ref("users")
    .orderByChild("online")
    .equalTo(true)
    .once("value");
  const arr = Object.keys(users.val());
  const length = arr.length;
  const userIndex = arr.indexOf(uid);
  if (length === 1) {
    return uid;
  }
  if (userIndex === length - 1) {
    return arr[0];
  }
  return arr[userIndex + 1];
};

export { db, auth, game, users, getNextUserId };
