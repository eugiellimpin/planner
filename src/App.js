import React, { useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCYwZHf6_JKzQxw2RJmLUg48rAiCclaBgI",
  authDomain: "ryan-florence-planner-clone.firebaseapp.com",
  projectId: "ryan-florence-planner-clone",
});

const db = firebase.firestore();
const todosRef = db.collection('todos')

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [todo, setTodo] = useState("");

  return (
    <div>
      {isEditing && (
        <textarea
          value={todo}
          onChange={(e) => setTodo(e.currentTarget.value)}
        />
      )}

      <button
        disabled={isEditing && todo.length < 1}
        onClick={() => {
          if (!isEditing) setIsEditing(true);

          if (todo.trim().length > 0) {
            todosRef.add({
              title: todo,
              done: false
            })
            setTodo('')
          }
        }}
      >
        Add task
      </button>
      {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
    </div>
  );
}

export default App;
