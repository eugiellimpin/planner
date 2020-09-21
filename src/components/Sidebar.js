import React from "react";
import c from "classnames";

import { SidebarIcon } from "./Icons";

function Sidebar({ user, labels, activeLabel, onLogout, onClickLabel }) {
  return (
    <nav className="max-h-screen relative sidebar flex flex-col px-24 pb-24 pt-48 border-r-4">
      <button className="invisible absolute h-18 p-6 right-6 top-0">
        <SidebarIcon />
      </button>

      <p className="mb-24">{user.displayName}</p>

      <div className="flex-1">
        <h3 className="uppercase text-sm font-bold text-gray-700 mb-12">
          Labels
        </h3>

        <ul className="">
          {labels.sort().map((l) => (
            <li
              className={c(
                { "font-bold text-gray-800": activeLabel === l },
                "text-gray-600 text-sm cursor-pointer mb-6 hover:font-bold hover:text-gray-800 transition transition-font duration-75"
              )}
              onClick={() => onClickLabel(l)}
              key={l}
            >
              {l}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="text-left text-sm text-gray-600 hover:font-bold transition transition-font duration-75"
        onClick={onLogout}
      >
        Logout
      </button>
    </nav>
  );
}

export default Sidebar;
