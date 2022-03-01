import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Chess from "chess.js";

import { socket, mySocketId } from "../../utils/socket";
import { Typography } from "@material-ui/core";

import styles from "./LiveGame.module.scss";
import { Share } from "../../components";

const maxWidth = 500;

let game = new Chess();

function LiveGame() {
  let { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [fenString, setFenString] = useState("start");
  const [dropSquareStyle, setDropSquareStyle] = useState({});
  const [squareStyles, setSquareStyles] = useState({});
  const [pieceSquare, setPieceSquare] = useState("");
  const [gameHistory, setGameHistory] = useState([]);
  const [displayBoard, setDisplayBoard] = useState(false);
  const [gameInfo, setGameInfo] = useState({});
  const [draggable, setDraggable] = useState(false);
  const [orientation, setOrientation] = useState("white");

  useEffect(() => {
    console.log(location);
    if (!location.state) {
      navigate(`/room`, {
        state: {
          gameId: gameId,
        },
      });
      return;
    } else {
      if (location.state.color) {
        setOrientation("white");
      } else {
        setOrientation("black");
      }
    }

    socket.on("playerLeft", () => {
      console.log("playerLeft");
      navigate(`/room`);
      alert("Opponent has left the game");
      return;
    });

    socket.on("status", (statusUpdate) => {
      alert(statusUpdate);
      if (
        statusUpdate === "This game session does not exist." ||
        statusUpdate === "There are already 2 people playing in this room."
      ) {
        setDisplayBoard(false);
      }
    });

    socket.on("movePlayed", (gameMove) => {
      const { socketId, from, to } = gameMove;
      if (mySocketId === socketId) {
        setDraggable(false);
        return;
      }
      let move = game.move({
        from: from,
        to: to,
        promotion: "q",
      });
      if (move === null) return;
      if (game.game_over()) {
        alert("game over");
      }
      setDraggable(true);
      setFenString(game.fen());
      setGameHistory(game.history({ verbose: true }));
      setSquareStyles(
        squareStyling({
          pieceSquare,
          gameHistory: game.history({ verbose: true }),
        }),
      );
    });

    socket.on("gameStarted", (gameInfo) => {
      setGameInfo(gameInfo);
      setDisplayBoard(true);
    });
    socket.on("gameCreated", (gameInfo) => {
      setGameInfo(gameInfo);
      setDraggable(true);
    });
  }, []);

  const removeHighlightSquare = () => {
    setSquareStyles(squareStyling({ pieceSquare, gameHistory }));
  };

  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%",
            },
          },
          ...squareStyling({
            gameHistory: gameHistory,
            pieceSquare: pieceSquare,
          }),
        };
      },
      {},
    );

    setSquareStyles({ ...squareStyles, ...highlightStyles });
  };

  const handleOnDrop = (props) => {
    const { piece, sourceSquare, targetSquare } = props;
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return;
    if (game.game_over()) {
      alert("game over");
    }
    socket.emit("playMove", {
      gameId: gameId,
      socketId: mySocketId,
      from: move.from,
      to: move.to,
      promotion: "q",
    });

    setFenString(game.fen());
    setGameHistory(game.history({ verbose: true }));
    setSquareStyles(
      squareStyling({
        pieceSquare,
        gameHistory: game.history({ verbose: true }),
      }),
    );
  };

  const handleOnMouseOverSquare = (square) => {
    let moves = game.moves({
      square: square,
      verbose: true,
    });

    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }
    highlightSquare(square, squaresToHighlight);
  };

  const handleOnMouseOutSquare = (square) => {
    removeHighlightSquare(square);
  };

  const handleOnDragOverSquare = (square) => {
    setDropSquareStyle(
      square === "e4" || square === "d4" || square === "e5" || square === "d5"
        ? { backgroundColor: "cornFlowerBlue" }
        : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" },
    );
  };

  const handleOnSquareClick = (square) => {
    setSquareStyles(
      squareStyling({
        pieceSquare: square,
        gameHistory: game.history({ verbose: true }),
      }),
    );
    setPieceSquare(square);

    if (!draggable) {
      return;
    }

    let move = game.move({
      from: pieceSquare,
      to: square,
      promotion: "q",
    });

    if (move === null) return;

    socket.emit("playMove", {
      gameId: gameId,
      socketId: mySocketId,
      from: move.from,
      to: move.to,
      promotion: "q",
    });
    if (game.game_over()) {
      alert("game over");
    }

    setFenString(game.fen());
    setGameHistory(game.history({ verbose: true }));
    setPieceSquare("");
  };

  const handleOnSquareRightClick = (square) => {
    setSquareStyles({ [square]: { backgroundColor: "deepPink" } });
  };

  const squareStyling = ({ pieceSquare, gameHistory }) => {
    const sourceSquare =
      gameHistory.length > 1 && gameHistory[gameHistory.length - 1].from;
    const targetSquare =
      gameHistory.length > 1 && gameHistory[gameHistory.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(gameHistory.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
      ...(gameHistory.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
    };
  };

  return (
    <>
      {displayBoard ? (
        <div className={styles.LiveGame}>
          <Typography className={styles.username} variant="h6">
            {orientation === "black"
              ? gameInfo.p1Username
              : gameInfo.p2Username}
          </Typography>
          <div className={styles.chessboardStyle}>
            <Chessboard
              position={fenString}
              onDrop={handleOnDrop}
              onSquareClick={handleOnSquareClick}
              onSquareRightClick={handleOnSquareRightClick}
              onMouseOverSquare={handleOnMouseOverSquare}
              onMouseOutSquare={handleOnMouseOutSquare}
              onDragOverSquare={handleOnDragOverSquare}
              squareStyles={squareStyles}
              dropSquareStyle={dropSquareStyle}
              draggable={draggable}
              orientation={orientation}
              width={maxWidth}
              calcWidth={(size) =>
                size.screenWidth > maxWidth && size.screenHeight > maxWidth
                  ? Math.min(size.screenWidth, size.screenHeight) - 100
                  : Math.min(size.screenWidth, size.screenHeight)
              }
            />
          </div>
          <Typography className={styles.username} variant="h6">
            {orientation === "white"
              ? gameInfo.p1Username
              : gameInfo.p2Username}
          </Typography>
        </div>
      ) : (
        <div className={styles.waitArea}>
          <p className={styles.waitText}> Invite your friend to join you</p>
          <Share link={window.location.href} />
        </div>
      )}
    </>
  );
}

export default LiveGame;
