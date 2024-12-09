// Connect to the socket server
const socket = io();

// DOM elements
const roomForm = document.getElementById("room-form");
const chatForm = document.getElementById("chat-form");
const messages = document.getElementById("messages");
const activeUsersList = document.getElementById("active-users");
const roomSelectionScreen = document.getElementById("room-selection");
const chatContainer = document.getElementById("chat-container");
const roomNameTitle = document.getElementById("room-name-title");
const leaveRoomButton = document.getElementById("leave-room");
const messageInput = document.getElementById("message-input");
const usernameInput = document.getElementById("username");
const roomNameInput = document.getElementById("room-name");

// Initially hide chat container
chatContainer.style.display = "none";

// When user joins or creates a room
roomForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const roomName = roomNameInput.value.trim();

  if (username && roomName) {
    // Emit joinRoom event
    socket.emit("joinRoom", { username, roomName });

    // Hide room selection screen and show chat container
    roomSelectionScreen.style.display = "none";
    chatContainer.style.display = "flex";

    // Set room name
    roomNameTitle.textContent = `Room: ${roomName}`;
  }
});

// Handle incoming messages
socket.on("message", ({ user, text, timestamp }) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `
    <div class="message-header">
      <strong class="user">${user}</strong> <span class="timestamp">${timestamp}</span>
    </div>
    <div class="message-body">${text}</div>
  `;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight; // Auto scroll to the bottom
});

// Update active users list
socket.on("activeUsers", (users) => {
  activeUsersList.innerHTML = ""; // Clear the current list
  users.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.innerHTML = `<strong>${user}</strong>`;
    activeUsersList.appendChild(userElement);
  });
});

// Handle sending chat messages
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (message) {
    socket.emit("chatMessage", message);
    messageInput.value = ""; // Clear the input field
  }
});

// Leave the current room
leaveRoomButton.addEventListener("click", () => {
  window.location.reload(); // Reload the page to reset the room state
});
