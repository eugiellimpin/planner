import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import App from "./App";

import "./styles/tailwind.css";

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = firebase.firestore();
const todosRef = db.collection("todos");

const authProvider = new firebase.auth.GoogleAuthProvider();

const Login = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser && !user) setUser(currentUser);
    });
  }, [user, setUser]);

  const login = () =>
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then((result) => {
        console.log(result.user);
        setUser(result.user);
      });

  const logout = () =>
    firebase
      .auth()
      .signOut()
      .then(() => setUser(undefined));

  return (
    <div>
      {!user && <button onClick={login}>login with Google</button>}

      {user && (
        <div>
          Current logged in user: {user.displayName} ({user.email})
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Login />
    <App todosRef={todosRef} />
  </React.StrictMode>,
  document.getElementById("root")
);
