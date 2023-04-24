import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import ChessGameImage from "../../assets/chessGame.png";
import { Button, Typography } from "@material-ui/core";

function Home() {
  const navigate = useNavigate();
  const handleLiveBtn = () => {
    navigate("/game");
  };
  const handlePracticeBtn = () => {
    navigate("/practice");
  };
  return (
    <div className={styles.page}>
      <div className={styles.imageDiv}>
        <img src={ChessGameImage} className={styles.chessGameImage} />
      </div>
      <div className={styles.rightContainer}>
        <Typography variant="h5">
          Play Chess with your friends with live chat
        </Typography>
        <button
          size="medium"
          className={`${styles.button} ${styles.button__primary}`}
          onClick={handlePracticeBtn}
        >
          Practice
        </button>
        <button
          size="medium"
          className={`${styles.button} ${styles.button__primary}`}
          onClick={handleLiveBtn}
        >
          Play with a Friend
        </button>
      </div>
    </div>
  );
}

export default Home;
