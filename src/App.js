import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import getDaysInMonth from "date-fns/getDaysInMonth";

import "./index.css";

function Todo({ todo, onMove, onChangeIsDone, moveButtonPosition }) {
  return (
    <li>
      {moveButtonPosition === "left" && <button onClick={onMove}>{"<"}</button>}

      <input
        type="checkbox"
        checked={todo.done}
        onChange={(e) => onChangeIsDone(e.currentTarget.checked)}
      />
      {todo.title}

      {moveButtonPosition === "right" && (
        <button onClick={onMove}>{">"}</button>
      )}
    </li>
  );
}

function CalendarDay({ onClick, isCurrent, children }) {
  return (
    <div onClick={onClick} className={isCurrent ? "bg-lightRed" : ""}>
      {children}
    </div>
  );
}

function Calendar({ onClickDay, isDisplayedDate, ...props }) {
  const currentDate = new Date();
  const dayCount = getDaysInMonth(currentDate);

  return (
    <div {...props}>
      <h2>Calendar</h2>
      <div className="grid-container">
        {[...new Array(dayCount).keys()].map((dayIndex) => {
          return (
            <CalendarDay
            key={dayIndex}
              onClick={() => onClickDay(dayIndex + 1)}
              isCurrent={isDisplayedDate(dayIndex + 1)}
            >
              {dayIndex + 1}
            </CalendarDay>
          );
        })}
      </div>
    </div>
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
            onMove={() => todosRef.doc(t.id).update({ dueDate: null })}
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
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const [todos, setTodos] = useState([]);
  const [displayedDate, setDisplayedDate] = useState(today.toDateString());

  const changeDisplayedDate = (dayOfMonth) => {
    setDisplayedDate(new Date(year, month, dayOfMonth).toDateString());
  };

  const isDisplayedDate = (dayOfMonth) => {
    return new Date(year, month, dayOfMonth).toDateString() === displayedDate;
  };

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

  const todosToday = todos.filter(
    (t) => t.dueDate && t.dueDate.toDate().toDateString() === displayedDate
  );
  const backlogTodos = todos.filter((t) => !t.dueDate);

  return (
    <div className="flex">
      <Calendar
        onClickDay={changeDisplayedDate}
        isDisplayedDate={isDisplayedDate}
        className="flex-grow-1"
      />
      <Day todos={todosToday} todosRef={todosRef} className="flex-grow-1" />
      <Backlog
        todos={backlogTodos}
        todosRef={todosRef}
        className="flex-grow-1"
      />
    </div>
  );
}

export default App;
