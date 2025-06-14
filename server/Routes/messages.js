import express from 'express';
import ChatMessage from '../models/ChatMessage.js';

const router = express.Router();

router.get('/messages/:room', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ room_name: req.params.room })
      .sort({ createdAt: 1 }); // Oldest to newest
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
