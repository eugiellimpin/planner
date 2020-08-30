import React, { useState, useEffect, useRef } from "react";
import c from "classnames";

import Checkbox from "./Checkbox";
import { IconButton } from "./Button";
import { MoveToInboxIcon, TrashIcon, ScheduleIcon } from "./Icons";

function Wrapper({ children, className }) {
  return (
    <li className={c("flex px-1 py-3 border-t", className)}>{children}</li>
  );
}

export function TodoForm({ onSave, todo, onCancel }) {
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
    <Wrapper className="flex-col">
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
    </Wrapper>
  );
}

export function Todo({ todo, onMove, onUpdate, onDelete, isScheduled }) {
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
    <Wrapper className="hover:bg-gray-100">
      <Checkbox
        isChecked={todo.done}
        onChange={(isChecked) => onUpdate({ id: todo.id, done: isChecked })}
        className="my-1"
      />
      <span
        onClick={() => setIsEditing(true)}
        className={c(
          "flex-grow px-2",
          todo.done && "text-gray-600 line-through"
        )}
      >
        {todo.title}
      </span>

      <span className="flex-shrink-0">
        <IconButton onClick={() => onDelete(todo.id)} className="mr-1">
          <TrashIcon />
        </IconButton>

        {isScheduled ? (
          <IconButton onClick={onMove}>
            <MoveToInboxIcon />
          </IconButton>
        ) : (
          <IconButton onClick={onMove} className="mr-1">
            <ScheduleIcon />
          </IconButton>
        )}
      </span>
    </Wrapper>
  );
}
