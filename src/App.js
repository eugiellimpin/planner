import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import getDaysInMonth from "date-fns/getDaysInMonth";
import isDate from "date-fns/isDate";

import { ReactComponent as PushLeftIcon } from "./assets/push_left.svg";
import { ReactComponent as PushRightIcon } from "./assets/push_right.svg";
import { ReactComponent as DeleteIcon } from "./assets/trash.svg";

function createTimestamp(date) {
  return new firebase.firestore.Timestamp(Math.floor(date.getTime() / 1000), 0);
}

function Todo({ todo, onMove, onUpdate, onDelete, moveButtonPosition }) {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <TodoForm
      todo={todo}
      onSave={(title) => {
        onUpdate({ id: todo.id, title });
        setIsEditing(false);
      }}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <li>
      {moveButtonPosition === "left" && (
        <button onClick={onMove}>
          <PushLeftIcon />
        </button>
      )}

      <input
        type="checkbox"
        checked={todo.done}
        onChange={(e) =>
          onUpdate({ id: todo.id, done: e.currentTarget.checked })
        }
      />
      <span onClick={() => setIsEditing(true)}>{todo.title}</span>

      <button onClick={() => onDelete(todo.id)}><DeleteIcon /></button>

      {moveButtonPosition === "right" && (
        <button onClick={onMove}>
          <PushRightIcon />
        </button>
      )}
    </li>
  );
}

function TodoForm({ onSave, todo, onCancel }) {
  const [isEditing, setIsEditing] = useState(!!todo);
  const [title, setTitle] = useState(!!todo ? todo.title : "");
  const saveLabel = !!todo ? "Save" : "Add task";

  return (
    <div>
      {isEditing && (
        <textarea
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
      )}

      <button
        disabled={isEditing && title.length < 1}
        onClick={() => {
          if (!isEditing) setIsEditing(true);

          if (title.trim().length > 0) {
            onSave(title);
            setTitle("");
          }
        }}
      >
        {saveLabel}
      </button>
      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            onCancel && onCancel();
          }}
        >
          Cancel
        </button>
      )}
    </div>
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

function TodoList({ todos, onMove, onUpdate, onDelete, moveButtonPosition }) {
  return (
    <ul>
      {todos.map((t) => (
        <Todo
          todo={t}
          onMove={() => onMove(t.id)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          moveButtonPosition={moveButtonPosition}
          key={t.id}
        />
      ))}
    </ul>
  );
}

function Day({ date, todos, todosRef, onSave, onUpdate, onDelete, ...props }) {
  const onMove = (id) => todosRef.doc(id).update({ dueDate: null });

  return (
    <div {...props}>
      <h2>{date.toDateString()}</h2>
      <TodoList
        todos={todos}
        onMove={onMove}
        moveButtonPosition="right"
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      <TodoForm onSave={onSave} />
    </div>
  );
}

function Backlog({
  onSave,
  onUpdate,
  todos,
  todosRef,
  displayedDate,
  onDelete,
  ...props
}) {
  const onMove = (id) =>
    todosRef.doc(id).update({ dueDate: createTimestamp(displayedDate) });

  return (
    <div {...props}>
      <h2>Backlog</h2>

      <TodoList
        todos={todos}
        onMove={onMove}
        onUpdate={onUpdate}
        onDelete={onDelete}
        moveButtonPosition="left"
      />

      <TodoForm onSave={(todo) => onSave(todo, null)} />
    </div>
  );
}

function App({ todosRef }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const [todos, setTodos] = useState([]);
  const [displayedDate, setDisplayedDate] = useState(today);

  const onDelete = (id) => {
    todosRef.doc(id).delete();
  };

  const onUpdate = ({ id, ...updatedTodo }) => {
    todosRef.doc(id).update(updatedTodo);
  };

  const onSave = (dueDate) => (title) => {
    todosRef.add({
      title,
      done: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      dueDate,
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
        className="flex-grow"
      />
      <Day
        date={displayedDate}
        todos={todosToday}
        todosRef={todosRef}
        onSave={onSave(createTimestamp(displayedDate))}
        onUpdate={onUpdate}
        onDelete={onDelete}
        className="flex-grow"
      />
      <Backlog
        onSave={onSave(null)}
        onUpdate={onUpdate}
        onDelete={onDelete}
        todos={backlogTodos}
        todosRef={todosRef}
        displayedDate={displayedDate}
        className="flex-grow"
      />
    </div>
  );
}

export default App;
