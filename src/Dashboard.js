import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import isDate from "date-fns/isDate";
import format from "date-fns/format";
import { addDays } from "date-fns";

import Calendar from "./components/Calendar";
import Sidebar from "./components/Sidebar";
import Column from "./components/Column";
import { Todo, TodoForm } from "./components/Todo";
import { IconButton } from "./components/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "./components/Icons";

function createTimestamp(date) {
  return new firebase.firestore.Timestamp(Math.floor(date.getTime() / 1000), 0);
}

function TodoList({
  todos,
  onMove,
  onUpdate,
  onDelete,
  isScheduled,
  className,
}) {
  return (
    <ul className={className}>
      {todos.map((t) => (
        <Todo
          todo={t}
          onMove={() => onMove(t.id)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isScheduled={isScheduled}
          key={t.id}
        />
      ))}
    </ul>
  );
}

function Day({
  date,
  todos,
  todosRef,
  onSave,
  onUpdate,
  onDelete,
  onChangeDay,
}) {
  const [showCompleted, setShowCompleted] = useState(false);

  const onMove = (id) => todosRef.doc(id).update({ dueDate: null });

  const completedTodos = todos.filter((t) => t.done);

  return (
    <Column>
      <div className="flex items-center justify-between">
        <IconButton onClick={() => onChangeDay(-1)} className="">
          <ChevronLeftIcon />
        </IconButton>

        <h2 className="column--header">{format(date, "EEE dd MMM")}</h2>

        <IconButton onClick={() => onChangeDay(1)} className="">
          <ChevronRightIcon />
        </IconButton>
      </div>

      <TodoList
        todos={todos.filter((t) => !t.done)}
        onMove={onMove}
        isScheduled={true}
        onUpdate={onUpdate}
        onDelete={onDelete}
        className="mb-18"
      />

      {completedTodos.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted((prev) => !prev)}
            className="flex justify-between w-full px-2 bg-gray-200 text-gray-600 focus:outline-none"
          >
            <span>{showCompleted ? "Completed" : "Show completed"}</span>
            <span>{completedTodos.length}</span>
          </button>

          {showCompleted && (
            <TodoList
              todos={completedTodos}
              onMove={onMove}
              isScheduled={true}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
        </div>
      )}

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
        isScheduled={false}
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
  const [activeLabel, setActiveFilter] = useState("");

  const onDelete = (id) => {
    todosRef.doc(id).delete();
  };

  const onUpdate = ({ id, ...updatedTodo }) => {
    todosRef.doc(id).update(updatedTodo);
  };

  const onSave = (dueDate) => ({ title, repeat, labels }) => {
    todosRef.add({
      title,
      done: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      dueDate,
      uid: user.uid,
      repeat,
      labels,
    });
  };

  const changeDisplayedDate = (dayOfMonth) => {
    setDisplayedDate(new Date(year, month, dayOfMonth));
  };

  const changeDay = (direction) => {
    if (!Number.isFinite(direction)) return;

    const offset = direction > 0 ? 1 : -1;
    setDisplayedDate((prev) => addDays(prev, offset));
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

  const labels = todos.reduce((result, todo) => {
    if (Array.isArray(todo.labels) && todo.labels.length > 0) {
      const toAdd = todo.labels.filter((l) => !result.includes(l));
      return [...result, ...toAdd];
    }

    return result;
  }, []);

  const todosToday = todos.filter((t) => {
    if (!!activeLabel && t.labels && !t.labels.includes(activeLabel))
      return false;

    return t.dueDate && isDisplayedDate(t.dueDate.toDate());
  });

  const backlogTodos = todos.filter((t) => {
    if (!!activeLabel && t.labels && !t.labels.includes(activeLabel))
      return false;

    return !t.dueDate;
  });

  return (
    <div className="with-sidebar">
      <Sidebar
        user={user}
        onLogout={onLogout}
        labels={labels}
        activeLabel={activeLabel}
        onClickLabel={(l) => setActiveFilter((prev) => (prev === l ? "" : l))}
      />

      <div className="main flex">
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
          onChangeDay={changeDay}
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
