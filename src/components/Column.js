import React from "react";
import c from "classnames";

function Column({ children, className }) {
  return (
    <div className={c('column h-screen flex-1 border-r px-4 pt-8', className)}>
      {children}
    </div>
  )
}

export default Column;
