require('dotenv').config() 

const path = require('path');
// const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const session = require('express-session')
const app = express();
const server = require('http').createServer(app)
var io = require('socket.io')(server)


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

app.set('socketio', io)

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
  secretOrKey: process.env.SECRET }
, async function ({ id }, cb) {
  try {
    const user = await User.findOne({ where: { id }, include: [Post] })
      cb (null, user) 
    } catch(err) {
        cb(err,null)
      }
  }))

app.use(require('./routes'))
//run on login or connect
io.on('login', socket => {
   console.log('new connection')
  socket.emit('Post','Welcome to Chat Wallet!')

   // broadcast when user logs in 
   socket.broadcast.emit('Post', `${User.username} has joined the chat`)

   socket.on('logout', socket => {
     io.emit('Post', `${User.username} has left the chat`)
      })
 })


const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server running on ${PORT}`))