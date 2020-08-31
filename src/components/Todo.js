import React, { useState, useEffect, useRef } from "react";
import c from "classnames";

import Checkbox from "./Checkbox";
import { Button, IconButton } from "./Button";
import { MoveToInboxIcon, TrashIcon, ScheduleIcon } from "./Icons";

function Wrapper({ children, className }) {
  return (
    <li className={c("flex px-1 py-3 border-t", className)}>{children}</li>
  );
}

export function TodoForm({ onSave, todo, onCancel, onDelete }) {
  const [isEditing, setIsEditing] = useState(!!todo);
  const [title, setTitle] = useState(!!todo ? todo.title : "");
  const [repeat, setRepeat] = useState(
    todo ? todo.repeat === "everyday" : false
  );
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
            className="w-full rounded border border-gray-400 p-2 focus:border-gray-600 focus:outline-none mb-2"
          />
        )}

        {isEditing && (
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={() => setRepeat((prev) => !prev)}
              checked={repeat}
            />
            Repeat every day
          </label>
        )}

        <div className="flex items-center justify-between">
          <span>
            <Button
              disabled={isEditing && title.length < 1}
              onClick={() => {
                if (!isEditing) setIsEditing(true);

                if (title.trim().length > 0) {
                  onSave({ title, repeat: repeat ? "everyday" : "" });
                  setTitle("");
                  setRepeat(false);
                }
              }}
            >
              {saveLabel}
            </Button>
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
          </span>

          {todo && (
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                onDelete(todo.id);
              }}
              className="mr-1"
            >
              <TrashIcon />
            </IconButton>
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
      onSave={(updatedTodo) => {
        onUpdate({ id: todo.id, ...updatedTodo });
        setIsEditing(false);
      }}
      onCancel={() => setIsEditing(false)}
      onDelete={onDelete}
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

      {isScheduled ? (
        <IconButton onClick={onMove}>
          <MoveToInboxIcon />
        </IconButton>
      ) : (
        <IconButton onClick={onMove} className="mr-1">
          <ScheduleIcon />
        </IconButton>
      )}
    </Wrapper>
  );
}
