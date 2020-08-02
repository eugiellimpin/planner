import React, { useState, useEffect } from "react";

import "./index.css";

function Day(props) {
  return <div {...props}>Current day</div>;
}

function Backlog({ todosRef, ...props }) {
  const [isEditing, setIsEditing] = useState(false);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = todosRef.onSnapshot((snapshot) => {
      const fetchedTodos = [];
      snapshot.forEach((t) => {
        fetchedTodos.push({ id: t.id, ...t.data() });
      });
      setTodos(fetchedTodos);
    });

    return unsubscribe;
  }, [todosRef]);

  return (
    <div {...props}>
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
  return (
    <div className="flex">
      <Day className="w-50p" />
      <Backlog todosRef={todosRef} className="w-50p" />
    </div>
  );
}

export default App;
