import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";

import Dashboard from "./Dashboard";
import Login from "./Login";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

const auth = firebase.auth();
const db = firebase.firestore();
const todosRef = db.collection("todos");

const trialUser = {
  uid: process.env.REACT_APP_TRIAL_USER_ID,
  displayName: "Guest",
};

function App() {
  const [user, setUser] = useState(trialUser);

  const logout = () => auth.signOut().then(() => setUser(undefined));

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser && user && user.uid !== currentUser.uid) {
        setUser(currentUser);
      }
    });
  }, [user, setUser]);

  return user ? (
    <Dashboard user={user} onLogout={logout} todosRef={todosRef} />
  ) : (
    <Login onLoggedIn={(user) => setUser(user)} />
  );
}

export default App;
