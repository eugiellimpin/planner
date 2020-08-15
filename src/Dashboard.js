import React, { useState, useEffect, useRef } from "react";
import * as firebase from "firebase/app";
import isDate from "date-fns/isDate";
import c from "classnames";
import format from "date-fns/format";

import { ReactComponent as PushLeftIcon } from "./assets/push_left.svg";
import { ReactComponent as PushRightIcon } from "./assets/push_right.svg";
import { ReactComponent as DeleteIcon } from "./assets/trash.svg";
import Calendar from "./components/Calendar";
import Navbar from "./components/Navbar";
import Column from "./components/Column";

function IconButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={c("hover:bg-gray-300 p-1 rounded", className)}
    >
      {children}
    </button>
  );
}

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
    <li className="flex items-center h-12 px-2 hover:bg-gray-100">
      {moveButtonPosition === "left" && (
        <IconButton onClick={onMove} className="mr-1">
          <PushLeftIcon />
        </IconButton>
      )}

      <input
        type="checkbox"
        checked={todo.done}
        onChange={(e) =>
          onUpdate({ id: todo.id, done: e.currentTarget.checked })
        }
      />
      <span onClick={() => setIsEditing(true)} className="flex-grow px-2">
        {todo.title}
      </span>

      <span>
        <IconButton onClick={() => onDelete(todo.id)} className="mr-1">
          <DeleteIcon />
        </IconButton>

        {moveButtonPosition === "right" && (
          <IconButton onClick={onMove}>
            <PushRightIcon />
          </IconButton>
        )}
      </span>
    </li>
  );
}

function TodoForm({ onSave, todo, onCancel }) {
  const [isEditing, setIsEditing] = useState(!!todo);
  const [title, setTitle] = useState(!!todo ? todo.title : "");
  const saveLabel = !!todo ? "Save" : "Add task";

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  return (
    <li className="flex flex-col">
      <form>
        {isEditing && (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="w-full rounded border border-gray-400 p-2 focus:border-gray-600 focus:outline-none"
          />
        )}

        <div className="mt-2">
          <button
            disabled={isEditing && title.length < 1}
            onClick={() => {
              if (!isEditing) setIsEditing(true);

              if (title.trim().length > 0) {
                onSave(title);
                setTitle("");
              }
            }}
            className="px-2 py-1 rounded bg-green-600 text-white font-bold focus:outline-none"
          >
            {saveLabel}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                onCancel && onCancel();
              }}
              className="px-2 py-1 text-gray-700 hover:underline focus:outline-none"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </li>
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

function Day({ date, todos, todosRef, onSave, onUpdate, onDelete }) {
  const onMove = (id) => todosRef.doc(id).update({ dueDate: null });

  return (
    <Column>
      <h2 className="column--header">{format(date, "EEE dd MMM")}</h2>
      <TodoList
        todos={todos}
        onMove={onMove}
        moveButtonPosition="right"
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      <TodoForm onSave={onSave} />
    </Column>
  );
}

function Backlog({
  onSave,
  onUpdate,
  todos,
  todosRef,
  displayedDate,
  onDelete,
}) {
  const onMove = (id) =>
    todosRef.doc(id).update({ dueDate: createTimestamp(displayedDate) });

  return (
    <Column className="hidden lg:block">
      <h2 className="column--header">Inbox</h2>

      <TodoList
        todos={todos}
        onMove={onMove}
        onUpdate={onUpdate}
        onDelete={onDelete}
        moveButtonPosition="left"
      />

      <TodoForm onSave={(todo) => onSave(todo, null)} />
    </Column>
  );
}

function Dashboard({ todosRef, user, onLogout }) {
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
      uid: user.uid,
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
    const unsubscribe = todosRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        const fetchedTodos = [];
        snapshot.forEach((t) => {
          fetchedTodos.push({ id: t.id, ...t.data() });
        });

        setTodos(fetchedTodos);
      });

    return unsubscribe;
  }, [todosRef, user]);

  const todosToday = todos.filter(
    (t) => t.dueDate && isDisplayedDate(t.dueDate.toDate())
  );
  const backlogTodos = todos.filter((t) => !t.dueDate);

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-col lg:flex-row">
        <Calendar
          onClickDay={changeDisplayedDate}
          isDisplayedDate={isDisplayedDate}
        />
        <Day
          date={displayedDate}
          todos={todosToday}
          todosRef={todosRef}
          onSave={onSave(createTimestamp(displayedDate))}
          onUpdate={onUpdate}
          onDelete={onDelete}
          className="column h-screen flex-1 border-r px-4 pt-8"
        />
        <Backlog
          onSave={onSave(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          todos={backlogTodos}
          todosRef={todosRef}
          displayedDate={displayedDate}
        />
      </div>
    </div>
  );
}

export default Dashboard;
