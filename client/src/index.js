import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./context/AuthContext";
import SemesterContextProvider from "./context/SemesterContext";
import StudentContextProvider from "./context/StudentContext";
import AttendanceContextProvider from "./context/AttendanceContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SemesterContextProvider>
        <StudentContextProvider>
          <AttendanceContextProvider>
            <App />
          </AttendanceContextProvider>
        </StudentContextProvider>
      </SemesterContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
