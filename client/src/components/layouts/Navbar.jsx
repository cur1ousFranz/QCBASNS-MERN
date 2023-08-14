import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  return (
    <div className="py-6 px-6 border-b flex justify-between">
      <div className="font-semibold text-xl">QCBASNS</div>
      {!user && (
        <div className="space-x-6">
          <Link to={"/login"} className="text-lg">
            Login
          </Link>
          <Link to={"/register"} className="text-lg">
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
