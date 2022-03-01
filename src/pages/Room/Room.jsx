import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button, Input, Typography } from "@material-ui/core";

import { socket } from "../../utils/socket";
import { generateGameId, validateGameId } from "../../utils/index.js";

import styles from "./Room.module.scss";

function Room({ username }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [joinGame, setJoinGame] = useState(false);
  const [gameId, setGameId] = useState("RoomCode");

  useEffect(() => {
    if (location.state) {
      setJoinGame(true);
      setGameId(location.state.gameId);
    }
  }, []);

  const handleCreateGame = () => {
    const newGameId = generateGameId();

    socket.emit("createGame", { username: username, gameId: newGameId });
    navigate(`/room/${newGameId}`, {
      state: {
        isCreator: true,
        username: username,
        gameId: newGameId,
        color: 1,
      },
    });
  };

  const handleJoinGame = () => {
    var submittedGameId = gameId;
    if (!validateGameId(submittedGameId)) {
      alert("invalid game id");
      return;
    }
    socket.emit("startGame", { username: username, gameId: submittedGameId });
    navigate(`/room/${submittedGameId}`, {
      state: {
        isCreator: false,
        username: username,
        gameId: submittedGameId,
        color: 0,
      },
    });
  };

  return (
    <>
      {joinGame ? (
        <>
          <Typography>Enter Room Code: </Typography>
          <Input
            required={true}
            id="roomcode"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <Button type="submit" onClick={handleJoinGame}>
            Enter
          </Button>
        </>
      ) : (
        <>
          <Button onClick={handleCreateGame}> Create a New Game </Button>
          <Button onClick={() => setJoinGame(true)}>Join a Game</Button>
        </>
      )}
    </>
  );
}

export default Room;
