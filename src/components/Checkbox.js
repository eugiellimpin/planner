import React from "react";
import c from "classnames";

import { ReactComponent as CircleIcon } from "../assets/circle.svg";
import { ReactComponent as CircleCheckIcon } from "../assets/check_circle.svg";

function Checkbox({ isChecked, onChange, className }) {
  return (
    <label className={c("checkbox relative cursor-pointer", className)}>
      <CircleIcon className="" />
      <CircleCheckIcon
        className={c("absolute top-0 z-10", !isChecked && "invisible")}
      />
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        className="sr-only"
      />
    </label>
  );
}

export default Checkbox;
