const express = require('express');
const router = express.Router();
const Subcategory = require('../models/Subcategory');

// Create a subcategory
router.post('/', async (req, res) => {
    try {
        const subcategory = new Subcategory(req.body);
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all subcategories
router.get('/', async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category_id');
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single subcategory by ID
router.get('/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('category_id');
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a subcategory
router.put('/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a subcategory
router.delete('/:id', async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        res.status(200).json({ message: 'Subcategory deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;