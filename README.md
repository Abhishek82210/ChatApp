# ChatApp

A real-time chat application .This app allows users to join chat rooms and send messages in real time.

## Features
- **Join Chat Rooms**: Create or join existing rooms.
- **Real-Time Messaging**: Messages are broadcast to all users in the room instantly.
- **User Notifications**: See when users join  a room.
- **Simple UI**: HTML, CSS, and JavaScript for a clean and intuitive user interface.

Technologies Used in Chat App
1. Backend

    Node.js:
        Used as the runtime environment to execute JavaScript on the server-side.
        Handles the server logic for setting up WebSocket communication with the help of Socket.IO.
    Socket.IO:
        A library for real-time, bi-directional communication between the client and server using WebSockets.
        The primary technology enabling the chat functionality (sending and receiving messages in real time).
    Express.js (Minimal Role):
        Only used to serve static files (HTML, CSS, JavaScript) from the public folder.
        Acts as a lightweight file server, without building APIs or complex routes.

2. Frontend

    HTML:
        Provides the structure of your chat app’s user interface, including forms and chat windows.
    CSS:
        Styles the UI to make it visually appealing and user-friendly.
    JavaScript:
        Adds interactivity on the client side, such as handling user input, managing chat messages, and responding to real-time events with Socket.IO.

3. Development Utilities

    NPM (Node Package Manager):
        Manages your project's dependencies, such as express and socket.io.
    package.json:
        Tracks project dependencies and scripts for starting the server (npm start).



