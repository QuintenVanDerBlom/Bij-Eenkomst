const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    sub_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    title: { type: String, required: true, maxlength: 150, unique: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Entry', entrySchema);