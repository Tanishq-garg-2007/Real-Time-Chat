// Routes/Messages.js
import express from 'express';
import Chat from '../models/chats.js';

const router = express.Router();

router.post('/messages', async (req, res) => {
  try {
    const { username, room, message } = req.body;
    const newMessage = new Chat({ username, room, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
