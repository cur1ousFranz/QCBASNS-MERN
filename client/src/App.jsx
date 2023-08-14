import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Navbar from "./components/layouts/Navbar";

function App() {
  return (
    <div className="App mx-auto">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
