const roomSelection = document.querySelector('.room-selection');
const chatContainer = document.querySelector('.chat-container');
const joinRoomButton = document.getElementById('join-room');
const leaveRoomButton = document.getElementById('leave-room');
const activeUsersList = document.getElementById('active-users');
const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

let username = '';
let room = '';
let users = [];

// Mock socket simulation
const socket = {
  on(event, callback) {
    if (event === 'user-joined') {
      setTimeout(() => callback({ username: 'NewUser', users: ['User1', 'User2', 'NewUser'] }), 2000);
    }
    if (event === 'user-left') {
      setTimeout(() => callback({ username: 'User1', users: ['User2', 'NewUser'] }), 4000);
    }
    if (event === 'message') {
      setTimeout(() => callback({ username: 'NewUser', message: 'Hello!' }), 1000);
    }
  },
  emit(event, data) {
    console.log(`Event: ${event}`, data);
  }
};

// Handle join room
joinRoomButton.addEventListener('click', () => {
  username = document.getElementById('username').value.trim();
  room = document.getElementById('room').value.trim();

  if (!username || !room) {
    alert('Please enter a username and room code.');
    return;
  }

  roomSelection.style.display = 'none';
  chatContainer.style.display = 'flex';

  // Simulate joining the room
  socket.emit('join-room', { username, room });
  socket.on('user-joined', (data) => {
    users = data.users;
    updateUserList();
    showMessage(`${data.username} has joined the room.`);
  });

  socket.on('user-left', (data) => {
    users = data.users;
    updateUserList();
    showMessage(`${data.username} has left the room.`);
  });

  socket.on('message', (data) => {
    showMessage(`${data.username}: ${data.message}`);
  });
});

// Handle leave room
leaveRoomButton.addEventListener('click', () => {
  roomSelection.style.display = 'flex';
  chatContainer.style.display = 'none';
  users = [];
  updateUserList();
});

// Handle sending messages
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    showMessage(`You: ${message}`);
    messageInput.value = '';
    socket.emit('message', { username, message });
  }
});

// Update active users list
function updateUserList() {
  activeUsersList.innerHTML = users.map((user) => `<li>${user}</li>`).join('');
}

// Show messages
function showMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
