import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import isDate from "date-fns/isDate";
import format from "date-fns/format";

import Calendar from "./components/Calendar";
import Navbar from "./components/Navbar";
import Column from "./components/Column";
import { Todo, TodoForm } from "./components/Todo";

function createTimestamp(date) {
  return new firebase.firestore.Timestamp(Math.floor(date.getTime() / 1000), 0);
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
