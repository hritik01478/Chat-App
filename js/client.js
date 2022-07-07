const socket = io('http://localhost:8000');

// Get DOM elements in respective JS elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on recieving messages
var audio = new Audio("../audio/tingtong.mp3");

// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    if (position == 'center') {
        messageElement.classList.add('messageCenter');
    }
    else {
        messageElement.classList.add('message');
    }
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') { audio.play() }
}

// Ask new user for his/her name and let the server know
const nam = prompt("Enter your name to join");
socket.emit('new-user-joined', nam);

// If new user joins, recieve his/her name from the server
socket.on('user-joined', nam => {
    append(`${nam} joined the chat`, 'center');
})

// If server sends a message, recieve it
socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', nam => {
    append(`${nam} left the chat`, 'center')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})