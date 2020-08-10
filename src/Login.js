import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";

const authProvider = new firebase.auth.GoogleAuthProvider();

const Login = ({ onLoggedIn }) => {
  const login = () =>
    firebase
      .auth()
      .signInWithPopup(authProvider)
      .then((result) => {
        console.log(result.user);
        onLoggedIn(result.user);
      });

  return (
    <div>
      <button onClick={login}>login with Google</button>
    </div>
  );
};

export default Login;
