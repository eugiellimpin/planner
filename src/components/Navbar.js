import React from "react";

function Navbar({ user, onLogout }) {
      return (<nav className="flex justify-between items-center h-12 shadow-md px-4">
        Hello {user.displayName}! 👋
        <button className="text-sm text-gray-600 hover:underline" onClick={onLogout}>Logout</button>
      </nav>);

}

export default Navbar;