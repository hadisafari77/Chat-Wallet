const socket = io();

const chat = document.querySelector('.chat-form')
const Input = document.querySelector('.chat-input')

chat.addEventListener('submit', event => {
  event.preventDefault()
  socket.emit('message', Input.value)
  Input.value = ''
})

socket.on('message', message => {
  console.log(message)
})