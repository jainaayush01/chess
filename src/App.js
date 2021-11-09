import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import { Button, AppBar, Toolbar, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Menu as MenuIcon } from "@material-ui/icons";

import Practice from './Practice';
import Room from './Room';
import Home from './Home';
import NotFound from './NotFound';
import Live from './LiveGame';

import './App.css';

const linkStyles = {
  color: "white",
  textDecoration: "none",
}

function App() {
  const [username, setUsername] = useState('');

  const [auth, setAuth] = useState(false);
  const handleSubmit = () => {
    let user = document.querySelector("#username").value;
    console.log(user);
    if(user === "") {
      return
    }
    else {
      setUsername(user);
      setAuth(true);
    }
  }

  return (
    <div className="App">
    <Router>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <MenuItem>
            <Link to="/" style={linkStyles} >
              <Typography variant="h6" >Home</Typography>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/practice" style={linkStyles} >
              <Typography variant="h6" >Practice</Typography>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/room" style={linkStyles} >
              <Typography variant="h6" >Room</Typography>
            </Link>
          </MenuItem>
          <Typography variant="h6" style={{ marginLeft: "auto" }}> {username} </Typography>
        </Toolbar>
      </AppBar>
      {
        !auth 
        ? <div className="auth">
            Name: <input type="text" id="username" />
            <Button style={{ display: "block", margin: "auto" }} type="submit" onClick={handleSubmit}> Submit </Button>
          </div>  
        : <div>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/practice" component={Practice} exact />
              <Route path="/room" render={() => <Room username={username}/>} exact />
              <Route path="/room/live/:gameId" render={() => <Live username={username}/>} exact />
              <Route component={NotFound} />
            </Switch>
          </div>
      }
      
    </Router>
    </div>
  );
}

export default App;