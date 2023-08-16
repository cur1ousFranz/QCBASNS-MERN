import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Navbar from "./components/layouts/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Register } from "./views/Register";
import Students from "./views/Students";
import Attendance from "./views/Attendance";
import Report from "./views/Report";
import Message from "./views/Message";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <div className="App mx-auto">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={"/student"} />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to={"/student"} />}
          />
          <Route
            path="/student"
            element={user ? <Students /> : <Navigate to={'/login'} />}
          />
          <Route
            path="/attendance"
            element={user ? <Attendance /> : <Navigate to={'/login'} />}
          />
          <Route
            path="/report"
            element={user ? <Report /> : <Navigate to={'/login'} />}
          />
          <Route
            path="/message"
            element={user ? <Message /> : <Navigate to={'/login'} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
