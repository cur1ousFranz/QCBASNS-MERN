import React from "react";
import Sidebar from "../components/layouts/Sidebar";

export default function Message() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-12">Message</div>
    </div>
  );
}
