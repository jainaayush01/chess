import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import { NotFound, Room, Home, Practice } from "./pages";
import { LiveGame } from "./components";

import "./App.css";

const linkStyles = {
  color: "white",
  textDecoration: "none",
};

function App() {
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [auth, setAuth] = useState(false);
  const handleSubmit = () => {
    let user = document.querySelector("#username").value;
    let remMe = document.querySelector("#rememberMe").checked;
    if (user === "") {
      return;
    } else {
      localStorage.setItem("rememberMe", remMe);
      localStorage.setItem("username", remMe ? user : "");
      setUsername(user);
      setRememberMe(remMe);
      setAuth(true);
    }
  };

  useEffect(() => {
    let remMe = localStorage.getItem("rememberMe") === "true";
    let user = localStorage.getItem("username");
    if (remMe) {
      setUsername(user);
      setAuth(true);
      setRememberMe(remMe);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <MenuItem>
              <Link to="/" style={linkStyles}>
                <Typography variant="h6">Home</Typography>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/practice" style={linkStyles}>
                <Typography variant="h6">Practice</Typography>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/room" style={linkStyles}>
                <Typography variant="h6">Room</Typography>
              </Link>
            </MenuItem>
            <Typography variant="h6" style={{ marginLeft: "auto" }}>
              {username}
            </Typography>
          </Toolbar>
        </AppBar>
        {!auth ? (
          <div className="auth">
            <div>
              Name: <input type="text" id="username" />{" "}
            </div>
            <div>
              <input id="rememberMe" type="checkbox" /> RememberMe{" "}
            </div>
            <Button
              style={{ display: "block", margin: "auto" }}
              type="submit"
              onClick={handleSubmit}
            >
              {" "}
              Submit{" "}
            </Button>
          </div>
        ) : (
          <div>
            <Switch>
              <Route path="/" component={Room} exact />
              <Route path="/practice" component={Practice} exact />
              <Route
                path="/room"
                render={() => <Room username={username} />}
                exact
              />
              <Route
                path="/room/live/:gameId"
                render={() => <LiveGame username={username} />}
                exact
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
