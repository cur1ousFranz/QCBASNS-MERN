import React from "react";

export default function InputLayout({ label, value }) {
  return (
    <div className="w-full relative">
      <p>
        {label}:{" "}
        <span className="px-2 py-1 rounded-md text-sm text-gray-700 bg-gray-100">
          {value}
        </span>
      </p>
    </div>
  );
}
