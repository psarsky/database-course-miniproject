import { Schema, model } from "mongoose";

const rentalSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  equipment: { type: Schema.Types.ObjectId, ref: "Equipment", required: true },
  rentalDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  returned: { type: Boolean, default: false },
  cost: { type: Number, required: false, min: 0 },
});

export default model("Rental", rentalSchema);
