import io from 'socket.io-client';

const URL = 'https://chess-backend.jainaayush01.repl.co/';

const socket = io(URL);

var mySocketId;

socket.on("connect", () => {
  mySocketId = socket.id;
  return;
});

export {
  socket,
  mySocketId
}