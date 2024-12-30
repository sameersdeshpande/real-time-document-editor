const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Socket.IO CORS Configuration
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',  // Allow requests from frontend running on port 3000
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,  // Allows cookies to be sent with cross-origin requests (if needed)
  }
});

// CORS Configuration for Express (optional for regular HTTP requests)
app.use(cors({
  origin: 'http://localhost:3000',  // Allow frontend to communicate with backend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true  // Allow cookies if needed
}));

let documentContent = 'Start Typing';  // Initial content for the document

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send the current document content to the new user
  socket.emit('document-update', documentContent);

  // Listen for document changes and broadcast them to other users
  socket.on('document-change', (newContent) => {
    documentContent = newContent;
    socket.broadcast.emit('document-update', documentContent);  // Broadcast the new content to other users
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
