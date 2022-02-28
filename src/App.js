import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotFound, Room, Home, Practice } from "./pages";
import { LiveGame } from "./components";
import AuthDialog from "./components/AuthModal/AuthModal";

import "./App.css";

const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <div className="App">
      {!auth ? (
        <>
          <AuthDialog auth={auth} setAuth={setAuth} />
        </>
      ) : (
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/practice" element={<Practice />} />
            <Route exact path="/room" element={<Room />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/room/:gameId" element={<LiveGame />} />
            <Route element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </div>
  );
};

export default App;
