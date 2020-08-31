import React from "react";
import c from "classnames";

export function Button({ children, className, ...props }) {
  return (
    <button
      className={c(
        "px-2 py-1 rounded bg-green-600 text-white font-bold focus:outline-none",
        className
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ children, className, ...props }) {
  return (
    <button
      className={c(
        "p-1 hover:bg-gray-300 rounded focus:outline-none",
        className
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
