import React from "react";
import Sidebar from "../components/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import Header from "../components/header-text/Header";

export default function Students() {
  const location = useLocation();
  
  return (
    <div className="flex">
      <Sidebar menu={location.pathname} />
      <div className="p-12">
        <Header title={`Students`} />
      </div>
    </div>
  );
}
