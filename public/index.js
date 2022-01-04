

const path = require('path')
app.use(express.static(path.join(__dirname + '/public')))

// emitting a message to the user that connects //
socket.on('Post', Post => {
  console.log(Post);
})