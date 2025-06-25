const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 150, unique: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Category', categorySchema);