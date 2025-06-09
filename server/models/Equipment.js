import { Schema, model } from "mongoose";

const equipmentSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  available: { type: Boolean, default: true },
  pricePerDay: { type: Number, required: true, min: 0 },
});

export default model("Equipment", equipmentSchema);
