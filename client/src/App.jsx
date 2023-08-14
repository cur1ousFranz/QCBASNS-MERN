import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Navbar from "./components/layouts/Navbar";
import Home from "./views/Home";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Register } from "./views/Register";

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
            element={!user ? <Login /> : <Navigate to={"/home"} />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to={"/home"} />}
          />
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to={'/login'} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
