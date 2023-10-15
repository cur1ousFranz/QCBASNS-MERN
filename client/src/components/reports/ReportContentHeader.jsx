import React from "react";

export default function ReportContentHeader({ title, value }) {
  return (
    <div className="flex space-x-2">
      <p className="p-1 font-semibold">{title}</p>
      <p className="p-1 border px-10 border-gray-900">{value}</p>
    </div>
  );
}
