import React, { useState, useEffect, useRef } from "react";
import c from "classnames";

import { ReactComponent as PushLeftIcon } from "../assets/push_left.svg";
import { ReactComponent as PushRightIcon } from "../assets/push_right.svg";
import { ReactComponent as DeleteIcon } from "../assets/trash.svg";
import Checkbox from "./Checkbox";

function IconButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={c("p-1 hover:bg-gray-300 rounded", className)}
    >
      {children}
    </button>
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

export function Todo({ todo, onMove, onUpdate, onDelete, moveButtonPosition }) {
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
    <li className="flex px-2 py-3 border-t hover:bg-gray-100">
      {moveButtonPosition === "left" && (
        <span>
          <IconButton onClick={onMove} className="mr-1">
            <PushLeftIcon />
          </IconButton>
        </span>
      )}

      <Checkbox
        isChecked={todo.done}
        onChange={(isChecked) => onUpdate({ id: todo.id, done: isChecked })}
        className="my-1"
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
