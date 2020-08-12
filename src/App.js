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

const db = firebase.firestore();
const todosRef = db.collection("todos");

function App() {
  const [user, setUser] = useState();

  const logout = () =>
    firebase
      .auth()
      .signOut()
      .then(() => setUser(undefined));

  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser && !user) setUser(currentUser);
    });
  }, [user, setUser]);

  return user ? (
    <Dashboard user={user} onLogout={logout} todosRef={todosRef} />
  ) : (
    <Login onLoggedIn={(user) => setUser(user)} />
  );
}

export default App;
