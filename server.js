const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

let users = {};

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    // Welcome current user
    socket.emit('message', `Welcome to the chat, ${username}!`);

    // Broadcast when a user connects
    socket.broadcast
      .to(room)
      .emit('message', `${username} has joined the chat`);

    // Send users in the room
    io.to(room).emit('updateUsers', getUsersInRoom(room));
  });

  socket.on('chatMessage', (message) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit(
        'message',
        `${user.username}: ${message}`
      );
    }
  });

  socket.on('leaveRoom', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', `${user.username} has left the room`);
      socket.leave(user.room);
      delete users[socket.id];
      io.to(user.room).emit('updateUsers', getUsersInRoom(user.room));
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', `${user.username} has left the room`);
      delete users[socket.id];
      io.to(user.room).emit('updateUsers', getUsersInRoom(user.room));
    }
  });
});

function getUsersInRoom(room) {
  return Object.values(users)
    .filter((user) => user.room === room)
    .map((user) => user.username);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
