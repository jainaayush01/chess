import React, { useState } from "react";
import Chessboard from "chessboardjsx";
import Chess from "chess.js";

import styles from "./Practice.module.scss";

const maxWidth = 500;

const game = new Chess();

function Practice() {
  const [fenString, setFenString] = useState("start");
  const [dropSquareStyle, setDropSquareStyle] = useState({});
  const [squareStyles, setSquareStyles] = useState({});
  const [pieceSquare, setPieceSquare] = useState("");
  const [history, setHistory] = useState([]);

  const removeHighlightSquare = () => {
    setSquareStyles(squareStyling({ pieceSquare, history }));
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
            history: history,
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

    setFenString(game.fen());
    setHistory(game.history({ verbose: true }));
    setSquareStyles(squareStyling({ pieceSquare, history }));
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
        history: game.history({ verbose: true }),
      }),
    );
    setPieceSquare(square);

    let move = game.move({
      from: pieceSquare,
      to: square,
      promotion: "q",
    });

    if (move === null) return;

    if (game.game_over()) {
      alert("game over");
    }

    setFenString(game.fen());
    setHistory(game.history({ verbose: true }));
    setPieceSquare("");
  };

  const handleOnSquareRightClick = (square) => {
    setSquareStyles({ [square]: { backgroundColor: "deepPink" } });
  };

  const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }),
    };
  };

  return (
    <div className={styles.page}>
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
          // width={maxWidth}
          calcWidth={(size) =>
            size.screenWidth > maxWidth && size.screenHeight > maxWidth
              ? Math.min(size.screenWidth, size.screenHeight) - 100
              : Math.min(size.screenWidth, size.screenHeight)
          }
        />
      </div>
    </div>
  );
}

export default Practice;
