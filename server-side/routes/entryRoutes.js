const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Create an entry
router.post('/', async (req, res) => {
    try {
        const entry = new Entry(req.body);
        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all entries, met filter op category_id als query param
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category_id) {
            filter.category_id = req.query.category_id;
        }
        const entries = await Entry.find(filter)
            .populate('category_id')
            .populate('sub_category_id')
            .populate('created_by');
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single entry by ID
router.get('/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id)
            .populate('category_id')
            .populate('sub_category_id')
            .populate('created_by');
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an entry
router.put('/:id', async (req, res) => {
    try {
        const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(entry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an entry
router.delete('/:id', async (req, res) => {
    try {
        const entry = await Entry.findByIdAndDelete(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
