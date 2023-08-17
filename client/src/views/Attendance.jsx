import React from "react";
import Sidebar from "../components/layouts/Sidebar";
import { useLocation } from "react-router-dom";

export default function Attendance() {
  const location = useLocation();
  return (
    <div className="flex">
      <Sidebar menu={location.pathname}/>
      <div className="p-12">Attendance</div>
    </div>
  );
}
