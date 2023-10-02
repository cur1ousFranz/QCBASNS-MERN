import React from "react";
import Header from "../components/header-text/Header";

export default function Message() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="p-12">
        <Header title={`Message`} />
      </div>
    </div>
  );
}
