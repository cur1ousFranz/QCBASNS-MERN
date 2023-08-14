import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="py-6 px-6 border-b flex justify-between">
      <div className="font-semibold text-xl">
        QCBASNS
      </div>
      <div className="space-x-6">
        <Link to={"/login"} className="text-lg">
          Login
        </Link>
        <Link to={"/register"} className="text-lg">
          Register
        </Link>
      </div>
    </div>
  );
}
