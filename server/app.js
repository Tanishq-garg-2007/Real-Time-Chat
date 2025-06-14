import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import mongoDb from './db.js';
import ChatMessage from './models/ChatMessage.js';

const app = express();
mongoDb();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ room, user_name }) => {
    socket.join(room);
    console.log(`${user_name} joined room ${room}`);

    socket.to(room).emit("user-joined", {
      message: `${user_name} has joined the room.`,
      user_name: "System"
    });
  });

  socket.on("message", async ({ message, room, user_name }) => {
    console.log(`Message from ${user_name} in ${room}: ${message}`);
    
    try {
      const newMessage = new ChatMessage({ room_name: room, user_name, message });
      await newMessage.save();
    } catch (err) {
      console.error("Error saving message:", err);
    }

    io.to(room).emit("receive-message", { message, user_name });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
