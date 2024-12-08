const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {}; // Track active rooms and their users

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("A user connected.");

  // When a user joins a room
  socket.on("joinRoom", ({ username, roomName }) => {
    socket.join(roomName);
    socket.username = username; // Store the username in the socket object

    if (!rooms[roomName]) rooms[roomName] = [];
    rooms[roomName].push(username);

    // Notify everyone in the room
    socket.broadcast.to(roomName).emit("message", {
      user: "Admin",
      text: `${username} has joined the room.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Notify the user themselves
    socket.emit("message", {
      user: "Admin",
      text: `Welcome to the room "${roomName}", ${username}!`,
      timestamp: new Date().toLocaleTimeString(),
    });
  });

  // When a user sends a chat message
  socket.on("chatMessage", (msg) => {
    const roomName = Array.from(socket.rooms).find((room) => room !== socket.id);
    if (roomName) {
      io.to(roomName).emit("message", {
        user: socket.username || "Unknown User",
        text: msg,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
