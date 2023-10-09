import React from "react";

export default function Footer() {
  return (
    <footer className="w-full px-12 py-6 bg-gray-100 border-t text-gray-800 sticky top-[100vh]">
      <div className="max-w-screen-xl py-6 mx-auto px-6">
        <h1 className="text-center mt-4">
          All rights reserved © {new Date().getFullYear()}
        </h1>
      </div>
    </footer>
  );
}
