const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store connected users in memory (for demo purposes)
let users = [];

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// When a user connects
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining a room
  socket.on('joinRoom', ({ username, room }) => {
    // Add user to the room
    socket.join(room);

    // Add user to the users array
    const user = { id: socket.id, username, room };
    users.push(user);

    // Emit updated list of users in the room
    io.to(room).emit('roomUsers', {
      room,
      users: users.filter(u => u.room === room),
    });

    // Send welcome message to the newly joined user
    socket.emit('message', {
      username: 'Admin',
      text: `Welcome to the room, ${username}!`,
    });

    // Notify other users in the room that a new user has joined
    socket.broadcast.to(room).emit('message', {
      username: 'Admin',
      text: `${username} has joined the room!`,
    });
  });

  // Handle sending chat messages
  socket.on('chatMessage', (msg) => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        username: user.username,
        text: msg,
      });
    }
  });

  // Handle leaving the room
  socket.on('leaveRoom', () => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      socket.leave(user.room);

      // Remove the user from the users array
      users = users.filter(u => u.id !== socket.id);

      // Emit the updated list of users in the room
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: users.filter(u => u.room === user.room),
      });

      // Notify the other users that a user has left
      socket.broadcast.to(user.room).emit('message', {
        username: 'Admin',
        text: `${user.username} has left the room.`,
      });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      // Remove the user from the users array when disconnected
      users = users.filter(u => u.id !== socket.id);

      // Emit the updated list of users in the room
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: users.filter(u => u.room === user.room),
      });

      // Notify the other users that the user has disconnected
      socket.broadcast.to(user.room).emit('message', {
        username: 'Admin',
        text: `${user.username} has left the room.`,
      });
    }
    console.log('A user disconnected');
  });
});

// Set up the server to listen on a port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
