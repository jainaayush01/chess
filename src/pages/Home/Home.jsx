import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import ChessGameImage from "../../assets/chessGame.png";
import { Button, Typography } from "@material-ui/core";

function Home() {
  const navigate = useNavigate();
  const handleLiveBtn = () => {
    navigate("/room");
  };
  const handlePracticeBtn = () => {
    navigate("/practice");
  };
  return (
    <div className={styles.home}>
      <div className={styles.imageDiv}>
        <img src={ChessGameImage} className={styles.chessGameImage} />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.title}>
          <Typography variant="h5">
            Play Chess with your friends with live chat
          </Typography>
        </div>
        <Button
          variant="contained"
          size="large"
          className={styles.btn}
          onClick={handlePracticeBtn}
        >
          Practice
        </Button>
        <Button
          variant="contained"
          size="large"
          className={styles.btn}
          onClick={handleLiveBtn}
        >
          Play with a Friend
        </Button>
      </div>
    </div>
  );
}

export default Home;
