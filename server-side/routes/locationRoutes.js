const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Create a location
router.post('/', async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find().populate('user_id');
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single location by ID
router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id).populate('user_id');
        if (!location) return res.status(404).json({ error: 'Location not found' });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a location
router.put('/:id', async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!location) return res.status(404).json({ error: 'Location not found' });
        res.status(200).json(location);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a location
router.delete('/:id', async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) return res.status(404).json({ error: 'Location not found' });
        res.status(200).json({ message: 'Location deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;