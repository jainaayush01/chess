import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button, TextField, Typography } from "@material-ui/core";

import { socket } from "../../utils/socket";
import { generateGameId, validateGameId } from "../../utils/index.js";

import styles from "./Room.module.scss";

function Room() {
  const navigate = useNavigate();
  const location = useLocation();
  const [joinGame, setJoinGame] = useState(false);
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState(undefined);

  useEffect(() => {
    if (localStorage.getItem("username")) {
      setUsername(localStorage.getItem("username"));
    }
    if (location.state) {
      setJoinGame(true);
      setGameId(location.state.gameId);
    }
  }, []);

  const handleCreateGame = () => {
    const newGameId = generateGameId();

    socket.emit("createGame", { username: username, gameId: newGameId });
    navigate(`/game/${newGameId}`, {
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
    navigate(`/game/${submittedGameId}`, {
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
      <div className={styles.page}>
        {joinGame ? (
          <div className={styles.joinContainer}>
            <Typography>Enter Room Code: </Typography>
            <TextField
              required={true}
              id="roomcode"
              value={gameId}
              placeholder="Enter Room Code"
              fullWidth
              className={styles.textField}
              InputProps={{className: styles.inputBase}}
              onChange={(e) => setGameId(e.target.value)}
            />
            <button
              size="medium"
              className={`${styles.button} ${styles.button__primary}`}
              onClick={handleJoinGame}
            >
              Join
            </button>
          </div>
        ) : (
          <>
            <button
              size="medium"
              className={`${styles.button} ${styles.button__primary}`}
              onClick={handleCreateGame}
            >
              Create a New Game
            </button>
            <button
              size="medium"
              className={`${styles.button} ${styles.button__primary}`}
              onClick={() => setJoinGame(true)}
            >
              Join a Game
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Room;
