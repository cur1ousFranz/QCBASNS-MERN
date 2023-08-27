import React from "react";

export default function ValidationMessage({ message }) {
  return <p className="text-sm absolute text-red-500">{message}</p>;
}
