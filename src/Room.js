import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Input, Typography } from '@material-ui/core';

import { v4 as uuidv4 } from 'uuid';
import { socket } from './socket';



function Room({ username }) {

  const history = useHistory();
  const location = useLocation();
  const [joinGame, setJoinGame] = useState(false);
  const [gameId, setGameId] = useState('RoomCode');

  useEffect(() => {
    if (location.state) {
      setJoinGame(true);
      setGameId(location.state.gameId);
    }
  }, [])


  const handleCreateGame = () => {
    const newGameId = uuidv4();

    socket.emit('createGame', { username: username, gameId: newGameId });
    history.push({
      pathname: `/room/live/${newGameId}`,
      state: {
        isCreator: true,
        username: username,
        gameId: newGameId,
        color: 1
      }
    })
  }

  const handleJoinGame = () => {
    var submittedGameId = gameId;
    socket.emit('startGame', { username: username, gameId: submittedGameId });
    history.push({
      pathname: `/room/live/${submittedGameId}`,
      state: {
        isCreator: false,
        username: username,
        gameId: submittedGameId,
        color: 0
      }
    })
  }

  return (
    <>
      {
        joinGame
          ? <>
            <Typography>Enter Room Code: </Typography>
            <Input required={true} id="roomcode" placeholder={gameId} onChange={(e) => { setGameId(e.target.value) }} />
            <Button type="submit" onClick={handleJoinGame}>Enter</Button>
          </>
          : <>
            <Button onClick={handleCreateGame}> Create a New Game </Button>
            <Button onClick={() => { setJoinGame(true) }}> Join a Game </Button>
          </>
      }
    </>
  )
}

export default Room;
