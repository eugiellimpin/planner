import React from "react";

function Sidebar({ user, labels, onLogout, onClickLabel }) {
  return (
    <nav className="sidebar flex flex-col p-24 border-r-4">
      <p className="mb-24">{user.displayName}</p>

      <div className="flex-1">
        <h3 className="uppercase text-sm font-bold text-gray-700 mb-12">Labels</h3>
        <ul className="">
          {labels.map((l) => (
            <li
              className="text-gray-600 text-sm cursor-pointer mb-6 hover:font-bold hover:text-gray-800 transition transition-font duration-75"
              onClick={() => onClickLabel(l)}
              key={l}
            >
              {l}
            </li>
          ))}
        </ul>
      </div>

      <button className="text-left text-sm text-gray-600 hover:font-bold transition transition-font duration-75" onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Sidebar;