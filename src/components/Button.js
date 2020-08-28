import React from "react";
import c from "classnames";

export function IconButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={c("p-1 hover:bg-gray-300 rounded focus:outline-none", className)}
    >
      {children}
    </button>
  );
}
