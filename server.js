require('dotenv').config()

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const session = require('express-session')
const app = express();
const server = http.createServer(app)
const formatMessage = require('./utils/messages')


sessionStore = new session.MemoryStore();
var io = socketio(server)
app.set('socketio', io)
let passportSocketIo = require('passport.socketio')

// io.use(passportSocketIo.authorize({
//   cookieParser: require('cookieParser'),
//   key: 'express.sid',
//   secret: process.env.SECRET,
//   store: sessionStore
// }))



const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
// defining passport path
const passport = require('passport')
// defining the required models for functionality
const { User, Post } = require('./models')

app.use(session({
  secret: process.env.SECRET, maxAge: 60 * 60 * 1000, resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60 * 30 * 1000 }
}));


//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//express uses passport and initializes / calls into session
app.use(passport.initialize())
app.use(passport.session())



// user authenticator
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
}
  , async function ({ id }, cb) {
    try {
      const user = await User.findOne({ where: { id }, include: [Post] })
      cb(null, user)
    } catch (err) {
      cb(err, null)
    }
  }))

app.use(require('./routes'))

const botName = 'Chat Bot'
//run on login or connect
io.on('connection', socket => {
  console.log('new connection')
  socket.emit('message', formatMessage(botName,'Welcome to Chat Wallet!'))


  // broadcast when user logs in 
  socket.broadcast.emit('message',formatMessage(botName, ` Has joined the Chat`))

  socket.on('disconnect', socket => {
    io.emit('message', formatMessage(botName, ` Has left the chat`))
  })

  //listen for chat message
  socket.on('chatMessage', (usermsg) => {
    console.log(usermsg)
    io.emit('message', formatMessage('', usermsg))
  })
  
})



const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server running on ${PORT}`))