import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import getDaysInMonth from "date-fns/getDaysInMonth";
import isDate from "date-fns/isDate";

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

function TodosList({ todos, onChangeIsDone, onMove, moveButtonPosition }) {
  return (
    <ul>
      {todos.map((t) => (
        <Todo
          todo={t}
          onChangeIsDone={(isDone) => onChangeIsDone(t.id, isDone)}
          onMove={() => onMove(t.id)}
          moveButtonPosition={moveButtonPosition}
          key={t.id}
        />
      ))}
    </ul>
  );
}

function Day({ date, todos, todosRef, ...props }) {
  const onChangeIsDone = (id, isDone) =>
    todosRef.doc(id).update({ done: isDone });
  const onMove = (id) => todosRef.doc(id).update({ dueDate: null });

  return (
    <div {...props}>
      <h2>{date.toDateString()}</h2>
      <TodosList
        todos={todos}
        onChangeIsDone={onChangeIsDone}
        onMove={onMove}
        moveButtonPosition="right"
      />
    </div>
  );
}

function Backlog({ onAddTodo, todos, todosRef, ...props }) {
  const onChangeIsDone = (id, isDone) =>
    todosRef.doc(id).update({ done: isDone });
  const onMove = (id) => todosRef
                .doc(id)
                .update({ dueDate: firebase.firestore.Timestamp.now() });

  return (
    <div {...props}>
      <h2>Backlog</h2>

      <TodosList
        todos={todos}
        onChangeIsDone={onChangeIsDone}
        onMove={onMove}
        moveButtonPosition="left"
      />

      <TodoForm onAddTodo={onAddTodo} />
    </div>
  );
}

function TodoForm({ onAddTodo }) {
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
            onAddTodo(todo);
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
  const [displayedDate, setDisplayedDate] = useState(today);

  const onAddTodo = (title) => {
    todosRef.add({
      title,
      done: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      // firebase.firestore.Timestamp.now();
      dueDate: null,
    });
  };

  const changeDisplayedDate = (dayOfMonth) => {
    setDisplayedDate(new Date(year, month, dayOfMonth));
  };

  const isDisplayedDate = (dayOfMonth) => {
    if (isDate(dayOfMonth)) {
      return dayOfMonth.toDateString() === displayedDate.toDateString();
    }

    return (
      new Date(year, month, dayOfMonth).toDateString() ===
      displayedDate.toDateString()
    );
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
    (t) => t.dueDate && isDisplayedDate(t.dueDate.toDate())
  );
  const backlogTodos = todos.filter((t) => !t.dueDate);

  return (
    <div className="flex">
      <Calendar
        onClickDay={changeDisplayedDate}
        isDisplayedDate={isDisplayedDate}
        className="flex-grow-1"
      />
      <Day
        date={displayedDate}
        todos={todosToday}
        todosRef={todosRef}
        className="flex-grow-1"
      />
      <Backlog
        onAddTodo={onAddTodo}
        todos={backlogTodos}
        todosRef={todosRef}
        className="flex-grow-1"
      />
    </div>
  );
}

export default App;
