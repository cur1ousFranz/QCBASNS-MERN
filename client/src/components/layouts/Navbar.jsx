import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  return (
    <div className="py-6 px-12 border-b flex justify-between">
      <div className="font-semibold text-xl">WELCOME!</div>
      {!user ? (
        <div className="space-x-6">
          <Link to={"/login"} className="text-lg">
            Login
          </Link>
          <Link to={"/register"} className="text-lg">
            Register
          </Link>
        </div>
      ) : (
        <div>
          <img
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            src="/img/person.svg"
            className="cursor-pointer"
            alt=""
          />

          {showProfileDropdown && (
            <div
              onMouseLeave={() => setShowProfileDropdown(false)}
              className="origin-top-right absolute right-0 mr-4 mt-2 w-44 z-10 rounded-md shadow-lg"
            >
              <div className="rounded-md border shadow-xs text-start bg-white">
                <div className="p-2 hover:bg-gray-100">
                  <Link
                    to={"/"}
                    onClick={handleLogout}
                    className="w-full flex"
                  >
                    <span className="mr-2 mt-1"><img src="/img/logout.svg" alt="" /></span>
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
