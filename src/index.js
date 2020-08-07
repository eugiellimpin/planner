import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import App from './App';

import './styles/tailwind.css';

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = firebase.firestore();
const todosRef = db.collection('todos')

ReactDOM.render(
  <React.StrictMode>
    <App todosRef={todosRef} />
  </React.StrictMode>,
  document.getElementById('root')
);