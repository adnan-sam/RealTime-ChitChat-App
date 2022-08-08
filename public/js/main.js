const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var audio = new Audio("./audiofiles/sms_ting.mp3");
var audio2 = new Audio("./audiofiles/join_ting.mp3");

// const roomNo = sessionStorage.getItem('NAME');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('messageYou', (message) => {
  console.log(message);
  outputMessageYou(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
socket.on('messageJoin', (message) => {
  console.log(message);
  outputMessageJoin(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('currUser', msg);
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  audio.play();
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.classList.add('special');
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}
//For first person view
function outputMessageYou(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add('messageYou');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = "You";
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}
//For user joining and exiting output message  (From Adnan Edits)
function outputMessageJoin(message) {
  audio2.play();
  const div = document.createElement('div');
  div.classList.add('divJoin');
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText ="● "+ user.username;
    li.style.fontWeight=500;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
document.getElementById('leave-btn-2').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

/* For Mobile View navigation bar drop down */
var a;
function show_hide() {
  if(a==1)
  {
    document.getElementById("option-active").style.display="none";
    document.getElementById("leave-btn-2").style.display="none";
    document.getElementById("social-icons").style.display="none";
    return a=0;
  }
  else
  {
    document.getElementById("option-active").style.display="inline";
    document.getElementById("leave-btn-2").style.display="inline";
    document.getElementById("social-icons").style.display="inline";
    return a=1;
  }
}

//Promt the user when he/she refreshes the page
window.onbeforeunload = function() {
  return "Data will not be saved!! Are you sure?";
}