import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import App from './App';

import './styles/tailwind.css';


firebase.initializeApp({
  apiKey: "AIzaSyCYwZHf6_JKzQxw2RJmLUg48rAiCclaBgI",
  authDomain: "ryan-florence-planner-clone.firebaseapp.com",
  projectId: "ryan-florence-planner-clone",
});

const db = firebase.firestore();
const todosRef = db.collection('todos')

ReactDOM.render(
  <React.StrictMode>
    <App todosRef={todosRef} />
  </React.StrictMode>,
  document.getElementById('root')
);