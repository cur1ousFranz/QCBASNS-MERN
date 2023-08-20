import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./context/AuthContext";
import SemesterContextProvider from "./context/SemesterContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SemesterContextProvider>
        <App />
      </SemesterContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
