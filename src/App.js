import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";

import "./index.css";

function Day({ todos, todosRef, ...props }) {
  return (
    <div {...props}>
      <h2>Current day</h2>

      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={(e) => {
                todosRef.doc(t.id).update({ done: e.currentTarget.checked });
              }}
            />
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Backlog({ todos, todosRef, ...props }) {
  const [isEditing, setIsEditing] = useState(false);
  const [todo, setTodo] = useState("");

  return (
    <div {...props}>
      <h2>Backlog</h2>

      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <button
              onClick={() =>
                todosRef
                  .doc(t.id)
                  .update({ dueDate: firebase.firestore.Timestamp.now() })
              }
            >
              <span
                role="img"
                aria-label="Set due date of todo to current selected day"
              >
                👈
              </span>
            </button>
            <input
              type="checkbox"
              checked={t.done}
              onChange={(e) => {
                todosRef.doc(t.id).update({ done: e.currentTarget.checked });
              }}
            />
            {t.title}
          </li>
        ))}
      </ul>

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
              done: false,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              // firebase.firestore.Timestamp.now();
              dueDate: null,
            });
            setTodo("");
          }
        }}
      >
        Add task
      </button>
      {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
    </div>
  );
}

function App({ todosRef }) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = todosRef.orderBy("createdAt").onSnapshot((snapshot) => {
      const fetchedTodos = [];
      snapshot.forEach((t) => {
        fetchedTodos.push({ id: t.id, ...t.data() });
      });

      setTodos(fetchedTodos);
    });

    return unsubscribe;
  }, [todosRef]);

  const today = new Date().toDateString();
  console.log("today is", today);
  const todosToday = todos.filter(
    (t) => t.dueDate && t.dueDate.toDate().toDateString() === today
  );
  const backlogTodos = todos.filter((t) => !t.dueDate);

  console.log(`there are ${todosToday.length} todos for today`);

  return (
    <div className="flex">
      <Day todos={todosToday} todosRef={todosRef} className="w-50p" />
      <Backlog todos={backlogTodos} todosRef={todosRef} className="w-50p" />
    </div>
  );
}

export default App;
