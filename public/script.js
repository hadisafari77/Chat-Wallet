const socket = io();
const box = document.querySelector('.chatbox')
const chat = document.querySelector('.chat-form')
const Input = document.querySelector('.chat-input')

chat.addEventListener('submit', event => {
  event.preventDefault()

  //message text
  const usermsg = Input.value

  socket.emit('chatMessage', usermsg)
  
  //clear input

  event.target.elements.usermsg.value = '';
  event.target.elements.usermsg.focus()
})

socket.on('message', message => {
  console.log(message)
  outputMessage(message);
  //scroll down
  box.scrollTop = box.scrollHeight
})


//outp;ut message to dom

function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message');
  div.innerHTML =`<p class="meta">${message.username} @ ${message.time}</p>
      <p class="text">${message.text}</p>`;
      document.querySelector('.chatbox').appendChild(div)
}