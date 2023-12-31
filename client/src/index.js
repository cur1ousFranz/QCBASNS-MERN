import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./context/AuthContext";
import SemesterContextProvider from "./context/SemesterContext";
import StudentContextProvider from "./context/StudentContext";
import AdviserContextProvider from "./context/AdviserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <AdviserContextProvider>
      <SemesterContextProvider>
        <StudentContextProvider>
            <App />
        </StudentContextProvider>
      </SemesterContextProvider>
    </AdviserContextProvider>
  </AuthContextProvider>
);
