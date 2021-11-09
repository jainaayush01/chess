// import React from 'react';
// import { render } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import { Button, AppBar, Toolbar, IconButton, Typography, MenuItem } from '@material-ui/core';
import { Menu as MenuIcon } from "@material-ui/icons";
import Practice from './Practice';
import Room from './Room';
import Home from './Home';
import Live from './live2';
// import Live from './Live';
import GameContext from './gameContext';

// import {initiateSocket} from './socket'
import './App.css';

const listStyles = {
  float: "right",

}

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

  const [isCreator, setIsCreator] = React.useState(false)

  const gameCreatedByPlayer = React.useCallback(() => {
    setIsCreator(true)
  }, [])

  const gameNotCreatedByPlayer = React.useCallback(() => {
    setIsCreator(false)
  }, [])

  // useEffect(() => {
  //   initiateSocket();
  // }, []);

  return (
    // <GameContext.Provider value={{isCreator: isCreator, gameCreatedByPlayer={gameCreatedByPlayer} gameNotCreatedByPlayer={gameNotCreatedByPlayer}} >
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
              <Route path="/room" render={(props) => <Room username={username} {...props} />} exact />
              <Route path="/room/live/:gameId" render={(props) => <Live username={username} {...props} />} exact />
            </Switch>
          </div>
      }
      
    </Router>
    </div>
    // </GameContext>
  );
}

export default App;