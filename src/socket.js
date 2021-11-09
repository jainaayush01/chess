import io from 'socket.io-client';

const URL = 'http://localhost:8000/';

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