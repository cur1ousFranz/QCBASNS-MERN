import React from "react";
import Sidebar from "../components/layouts/Sidebar";

export default function Students() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-12">Students</div>
    </div>
  );
}
