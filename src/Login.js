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
    <div className="bg-gray-100 flex h-screen">
      <div className="flex flex-col justify-between bg-white rounded border h-40 w-64 mt-48 mx-auto p-5">
        <h1 className="font-bold text-lg">Log in</h1>
        <button
          className="mb-4 py-2 text-sm border rounded block w-full focus:outline-none hover:bg-gray-200 hover:border-gray-300"
          onClick={login}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
