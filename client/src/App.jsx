import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Navbar from "./components/layouts/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Register } from "./views/Register";
import Message from "./views/Message";
import Footer from "./components/layouts/Footer";
import Attendance from "./views/attendance/Attendance";
import SemesterAttendances from "./views/attendance/SemesterAttendances";
import AttendanceStudents from "./views/attendance/AttendanceStudents";
import Students from "./views/student/Students";
import SemesterStudents from "./views/student/SemesterStudents";
import Report from "./views/report/Report";
import ReportSemester from "./views/report/ReportSemester";

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
            element={!user ? <Login /> : <Navigate to={"/attendance"} />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to={"/attendance"} />}
          />
          <Route
            path="/student"
            element={user ? <Students /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/student/semester/:semesterId"
            element={user ? <SemesterStudents /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/attendance"
            element={user ? <Attendance /> : <Navigate to="/login" />}
          />
          <Route
            path="attendance/semester/:semesterId"
            element={<SemesterAttendances />}
          />
          <Route
            path="attendance/semester/:semesterId/attendance/:attendanceId"
            element={<AttendanceStudents />}
          />
          <Route
            path="/report"
            element={user ? <Report /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/report/semester/:semesterId"
            element={user ? <ReportSemester /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/message"
            element={user ? <Message /> : <Navigate to={"/login"} />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
