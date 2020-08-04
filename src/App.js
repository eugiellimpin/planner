import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";

import "./index.css";

function Todo({ todo, onMove, onChangeIsDone, moveButtonPosition }) {
  return (
    <li>
      {moveButtonPosition === 'left' && (
      <button onClick={onMove}>
        {"<"}
      </button>)}

      <input
        type="checkbox"
        checked={todo.done}
        onChange={(e) => onChangeIsDone(e.currentTarget.checked)}
      />
      {todo.title}

      {moveButtonPosition === 'right' && (
      <button onClick={onMove}>
        {">"}
      </button>)}
    </li>
  );
}

function Day({ todos, todosRef, ...props }) {
  return (
    <div {...props}>
      <h2>Current day</h2>

      <ul>
        {todos.map((t) => (
          <Todo
            todo={t}
            onChangeIsDone={(isDone) =>
              todosRef.doc(t.id).update({ done: isDone })
            }
            onMove={() =>
              todosRef
                .doc(t.id)
                .update({ dueDate: null })
            }
            moveButtonPosition="right"
            key={t.id}
          />
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
          <Todo
            todo={t}
            onChangeIsDone={(isDone) =>
              todosRef.doc(t.id).update({ done: isDone })
            }
            onMove={() =>
              todosRef
                .doc(t.id)
                .update({ dueDate: firebase.firestore.Timestamp.now() })
            }
            moveButtonPosition="left"
            key={t.id}
          />
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
