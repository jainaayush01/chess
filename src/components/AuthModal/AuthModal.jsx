import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import styles from "./AuthModal.module.scss";

export default function AuthDialog({ auth, setAuth }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (localStorage.getItem("username")) {
      setAuth(true);
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (username === "") {
      setError(true);
    } else {
      setOpen(false);
      setAuth(true);
      localStorage.setItem("username", username);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Login
      </Button>
      <Dialog open={open} onClose={handleClose}>
        {/* <DialogTitle>Login</DialogTitle> */}
        <DialogContent>
          {error ? (
            <DialogContentText color="red" variant="h8">
              Error: empty username
            </DialogContentText>
          ) : (
            <></>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Enter your username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
