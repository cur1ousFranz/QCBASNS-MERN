import React from "react";
import Sidebar from "../components/layouts/Sidebar";
import { useLocation } from "react-router-dom";

export default function Message() {
  const location = useLocation();
  
  return (
    <div className="flex">
      <Sidebar menu={location.pathname}/>
      <div className="p-12">Message</div>
    </div>
  );
}
