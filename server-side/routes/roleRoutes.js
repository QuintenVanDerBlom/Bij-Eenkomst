const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// Create a role
router.post('/', async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a role
router.put('/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a role
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.status(200).json({ message: 'Role deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;