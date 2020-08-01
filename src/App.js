import React, { useState, useEffect } from "react";

function App({ todosRef }) {
  const [isEditing, setIsEditing] = useState(false);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const unsubscribe = todosRef.onSnapshot(snapshot => {
      const fetchedTodos = [];
      snapshot.forEach(t => {
        fetchedTodos.push({ id: t.id, ...t.data() })
      });
      setTodos(fetchedTodos);
    })

    return unsubscribe;
  }, [todosRef]);

  return (
    <div>
      <ul>
        {todos.map(t => <li key={t.id}>{t.title}</li>)}
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
