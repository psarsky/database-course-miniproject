const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // np. narty, buty, kask
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
