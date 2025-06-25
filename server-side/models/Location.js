const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, maxlength: 150, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Location', locationSchema);