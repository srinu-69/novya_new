import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudyRoom from "./pages/StudyRoom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    setIsLoggedIn(loggedIn === "true");
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/studyroom" /> : <Signup />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/studyroom" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/studyroom"
          element={isLoggedIn ? <StudyRoom setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;