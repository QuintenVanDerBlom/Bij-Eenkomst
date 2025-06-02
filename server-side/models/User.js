const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: { type: String, required: true, maxlength: 100 },
    mail_adress: { type: String, required: true, maxlength: 150, unique: true },
    password: { type: String, required: true, maxlength: 255 },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);