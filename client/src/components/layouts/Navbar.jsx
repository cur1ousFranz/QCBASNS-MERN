import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AdviserContext } from "../../context/AdviserContext";

export default function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const { user, dispatch } = useContext(AuthContext);
  const { adviser } = useContext(AdviserContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setShowProfileDropdown(false);
    localStorage.removeItem("user");
  };

  const AdviserName = () => {
    if (adviser) {
      return (
        <h1 className="mt-2 text-sm font-semibold text-gray-600">
          {adviser.first_name}{" "}
          {adviser.middle_name !== "N/A" ? adviser.middle_name : ""}{" "}
          {adviser.last_name} {adviser.suffix !== "N/A" ? adviser.suffix : ""}
        </h1>
      );
    }
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
          <div className="flex space-x-3">
            <AdviserName />
            <img
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              src="/img/person.svg"
              className="cursor-pointer"
              alt=""
            />
          </div>

          {showProfileDropdown && (
            <div
              onMouseLeave={() => setShowProfileDropdown(false)}
              className="origin-top-right absolute right-0 mr-12 mt-1 w-72 z-10 rounded-md shadow-lg"
            >
              <div className="rounded-md border shadow-xs text-start bg-white">
                {adviser && (
                  <div className="flex px-3 py-2 border-b bg-gray-50">
                    <span className="mr-2 mt-1">
                      <img src="/img/person.svg" alt="" />
                    </span>
                    <AdviserName />
                  </div>
                )}
                <div className="p-2 hover:bg-gray-100">
                  <Link
                    to={"/"}
                    onClick={handleLogout}
                    className="w-full font-semibold flex text-red-400"
                  >
                    <span className="mr-2 mt-1">
                      <img src="/img/logout.svg" alt="" />
                    </span>
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
