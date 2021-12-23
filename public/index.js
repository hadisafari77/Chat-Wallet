const socket = io();

// emitting a message to the user that connects //
socket.on('Post', message => {
  console.log(message);
})