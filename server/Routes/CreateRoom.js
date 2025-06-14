import express from 'express';
import Chat from '../models/chats.js';

const router = express.Router();

router.post('/messages', async (req, res) => {
    console.log("Received request to save message");
  try {
    console.log("1");
    const { username, room, message } = req.body;
    console.log("2");
    const newMessage = new Chat({ username, room, message });
    console.log("3");
    await newMessage.save();
    console.log("4");
    res.status(201).json({ success: true, message: "Message saved" });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
