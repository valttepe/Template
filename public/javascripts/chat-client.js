'use strict';
let msg = {};
const chatarea = document.querySelector('.chatarea');
const socket = io.connect('http://localhost:3001');
socket.on('message', function(data) {
  console.log(data);
  chatarea.value += data['username'] + ': ' + data['message'] + '\n';
  chatarea.scrollTop = chatarea.scrollHeight;
});
socket.on('connect', function() {
      console.log('socket.io connected!');
});
socket.on('disconnect', function() {
      console.log('socket.io connected!');
});
const sendMsg = () => {
  msg.json = 'json';
  console.log(msg);
  socket.json.emit('message', msg);
};
// setTimeout(sendMsg, 1000);

const chatform = document.querySelector('#chatform');
chatform.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const username = document.querySelector('.username');
  const message = document.querySelector('.message');
  msg.username = username.value;
  msg.message = message.value;
  sendMsg();
});

