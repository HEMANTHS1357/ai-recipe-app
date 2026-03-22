const express = require('express');
const router = express.Router();
const Pantry = require('../models/Pantry');

// Get all pantry items
router.get('/', async (req, res) => {
  try {
    const items = await Pantry.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a pantry item
router.post('/', async (req, res) => {
  try {
    const item = new Pantry(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a pantry item
router.put('/:id', async (req, res) => {
  try {
    const updated = await Pantry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a pantry item
router.delete('/:id', async (req, res) => {
  try {
    await Pantry.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;