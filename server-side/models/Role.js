const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 50 },
});

module.exports = mongoose.model('Role', roleSchema);