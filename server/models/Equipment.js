const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // np. narty, buty, kask
  available: { type: Boolean, default: true },
  pricePerDay: { type: Number, required: true, min: 0 } // cena za rozpoczęte 24h
});

module.exports = mongoose.model('Equipment', equipmentSchema);
