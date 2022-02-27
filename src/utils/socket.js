import io from "socket.io-client";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const socket = io(REACT_APP_BACKEND_URL);

console.log(REACT_APP_BACKEND_URL);

var mySocketId;

socket.on("connect", () => {
  mySocketId = socket.id;
  return;
});

export { socket, mySocketId };
