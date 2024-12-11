const socket = io(); // Connect to the server

// DOM Elements
const roomCodeInput = document.getElementById('room');
const usernameInput = document.getElementById('username');
const joinButton = document.getElementById('join-btn');
const leaveButton = document.getElementById('leave-room');
const chatContainer = document.getElementById('chat-container');
const activeUsersBox = document.getElementById('active-users');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-message');
const roomCodeDisplay = document.getElementById('room-code-value');

// Show chat and active user section after joining a room
function showChat() {
  document.getElementById('room-selection').style.display = 'none';
  chatContainer.style.display = 'flex';
}

// When the user clicks on the Join button
joinButton.addEventListener('click', () => {
  const username = usernameInput.value;
  const room = roomCodeInput.value;

  if (username && room) {
    // Emit joinRoom event to the server with username and room code
    socket.emit('joinRoom', { username, room });
    roomCodeDisplay.textContent = room; // Display the room code in the chat header
    showChat(); // Show the chat and active user section
  } else {
    alert('Please enter both username and room code');
  }
});

// Emit chat message when the user sends a message
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('chatMessage', message);
    messageInput.value = ''; // Clear input after sending
  }
});

// Emit leaveRoom event when the user wants to leave the room
leaveButton.addEventListener('click', () => {
  socket.emit('leaveRoom');
  chatContainer.style.display = 'none'; // Hide the chat container
  document.getElementById('room-selection').style.display = 'block'; // Show room selection again
});

// Listen for incoming messages
socket.on('message', (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<strong>${message.username}</strong>: ${message.text} <span class="timestamp">${new Date().toLocaleTimeString()}</span> <span class="date">${new Date().toLocaleDateString()}</span>`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
});

// Listen for updated active users list
socket.on('roomUsers', ({ users }) => {
  activeUsersBox.innerHTML = ''; // Clear existing users
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user.username;
    activeUsersBox.appendChild(li);
  });
});

// Handle socket disconnect
socket.on('disconnect', () => {
  alert('You have been disconnected from the server.');
});

// Automatically scroll to the bottom of the chat on new messages
messagesContainer.scrollTop = messagesContainer.scrollHeight;
