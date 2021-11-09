import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import Chess from "chess.js";

import { socket, mySocketId } from './socket';
import { Typography } from '@material-ui/core';

import './LiveGame.css'

const chessboardStyle = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: 10,
  marginBottom: 10
}

let game = new Chess();

function LiveGame() {
  let { gameId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const [fenString, setFenString] = useState("start");
  const [dropSquareStyle, setDropSquareStyle] = useState({});
  const [squareStyles, setSquareStyles] = useState({});
  const [pieceSquare, setPieceSquare] = useState("");
  const [gameHistory, setGameHistory] = useState([]);
  const [displayBoard, setDisplayBoard] = useState(false);
  const [gameInfo, setGameInfo] = useState({});
  const [draggable, setDraggable] = useState(false);
  const [orientation, setOrientation] = useState('white');

  useEffect(() => {
    if (!location.state) {
      history.push({
        pathname: `/room`,
        state: {
          gameId: gameId
        }
      })
      return;
    }
    else {
      if (location.state.color) {
        setOrientation('white')
      }
      else {
        setOrientation('black')
      }
    }
    socket.on("status", statusUpdate => {
      alert(statusUpdate)
      if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 2 people playing in this room.') {
        setDisplayBoard(false);
      }
    })

    socket.on('movePlayed', (gameMove) => {
      const { socketId, from, to } = gameMove;
      if (mySocketId === socketId) {
        setDraggable(false);
        return;
      }
      let move = game.move({
        from: from,
        to: to,
        promotion: "q"
      })
      if (move === null) return;
      if (game.game_over()) {
        alert('game over');
      }
      setDraggable(true);
      setFenString(game.fen());
      setGameHistory(game.history({ verbose: true }));
      setSquareStyles(squareStyling({ pieceSquare, gameHistory: game.history({ verbose: true }) }));
    })

    socket.on('gameStarted', (gameInfo) => {
      setGameInfo(gameInfo);
      setDisplayBoard(true);
    })
    socket.on('gameCreated', (gameInfo) => {
      setGameInfo(gameInfo);
      setDraggable(true);
    })
  }, [])

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
              borderRadius: "50%"
            }
          },
          ...squareStyling({
            gameHistory: gameHistory,
            pieceSquare: pieceSquare
          })
        };
      },
      {}
    );

    setSquareStyles({ ...squareStyles, ...highlightStyles });
  }

  const handleOnDrop = (props) => {
    const { piece, sourceSquare, targetSquare } = props;
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });


    if (move === null) return;
    if (game.game_over()) {
      alert('game over');
    }
    socket.emit('playMove', { gameId: gameId, socketId: mySocketId, from: move.from, to: move.to, promotion: "q" });

    setFenString(game.fen())
    setGameHistory(game.history({ verbose: true }));
    setSquareStyles(squareStyling({ pieceSquare, gameHistory: game.history({ verbose: true }) }));
  }

  const handleOnMouseOverSquare = (square) => {
    let moves = game.moves({
      square: square,
      verbose: true
    });

    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }
    highlightSquare(square, squaresToHighlight);
  }

  const handleOnMouseOutSquare = (square) => {
    removeHighlightSquare(square);
  }

  const handleOnDragOverSquare = square => {
    setDropSquareStyle(
      square === "e4" || square === "d4" || square === "e5" || square === "d5"
        ? { backgroundColor: "cornFlowerBlue" }
        : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    );
  };

  const handleOnSquareClick = (square) => {
    let piece = game.get(square);
    if (!piece) {
      setSquareStyles(squareStyling({ pieceSquare: square, gameHistory: game.history({ verbose: true }) }));
      return;
    }
    piece = piece.type;
    setPieceSquare(square);
    let move = game.move({
      from: pieceSquare,
      to: square,
      promotion: "q"
    });

    if (move === null) return;

    if (game.game_over()) {
      alert('game over');
    }
    socket.emit('playMove', { gameId: gameId, socketId: mySocketId, from: move.from, to: move.to, promotion: "q" });
    setFenString(game.fen())
    setGameHistory(game.history({ verbose: true }));
    setPieceSquare("");
  }

  const handleOnSquareRightClick = (square) => {
    setSquareStyles({ [square]: { backgroundColor: "deepPink" } })
  }

  const squareStyling = ({ pieceSquare, gameHistory }) => {
    const sourceSquare = gameHistory.length > 1 && gameHistory[gameHistory.length - 1].from;
    const targetSquare = gameHistory.length > 1 && gameHistory[gameHistory.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(gameHistory.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      }),
      ...(gameHistory.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      })
    };
  };

  return (
    <>
      {displayBoard ?
        <div className="LiveGame">
          <Typography className="username" variant="h6">{orientation === 'black' ? gameInfo.p1Username : gameInfo.p2Username}</Typography>
          <div style={chessboardStyle} >
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
            />
          </div>
          <Typography className="username" variant="h6">{orientation === 'white' ? gameInfo.p1Username : gameInfo.p2Username}</Typography>
        </div>
        :
        <div>
          Let your friend join the game
        </div>
      }
    </>
  );
}

export default LiveGame;
