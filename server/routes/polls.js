const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// POST /api/polls - Create a new poll
router.post('/', async (req, res) => {
  try {
    const { question, options } = req.body;
    const newPoll = new Poll({
      question,
      options: options.map(text => ({ text, votes: 0 })),
    });
    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(500).json({ message: 'Error creating poll', error });
  }
});

// GET /api/polls/:pollId - Fetch a single poll
router.get('/:pollId', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found. It may have expired.' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching poll', error });
  }
});

module.exports = router;