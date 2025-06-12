const express = require('express');
const router = express.Router();
const Chat = require('../models/chats');

router.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Chat(req.body);
    await newMessage.save();
    res.status(201).send({ message: 'Message saved!' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
