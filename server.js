const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

//run on login or connect
io.on('connection', socket => {
  console.log('new connection')
})

const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server running on ${PORT}`))