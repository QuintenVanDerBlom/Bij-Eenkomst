const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Subcategory', subcategorySchema);