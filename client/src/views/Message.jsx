import React from "react";
import Header from "../components/header-text/Header";

export default function Message() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <div className="flex">
        <div className="py-12 px-6 lg:px-12 w-full space-y-3">
          <Header title={`Message`} />
        </div>
      </div>
    </div>
  );
}
