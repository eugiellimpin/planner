import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import logo from './logo.svg';
import './App.css';

firebase.initializeApp({
  apiKey: 'AIzaSyCYwZHf6_JKzQxw2RJmLUg48rAiCclaBgI',
  authDomain: 'ryan-florence-planner-clone.firebaseapp.com',
  projectId: 'ryan-florence-planner-clone',
});

const db = firebase.firestore();

function App() {
  console.log(firebase);
  console.log(db);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
