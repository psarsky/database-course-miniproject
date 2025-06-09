import User from "../models/User.js";
import Rental from "../models/Rental.js";
import Equipment from "../models/Equipment.js";
import { startSession } from "mongoose";

// Transaction-based equipment rental
const rentEquipment = async (req, res) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { user, equipment, rentalDate, returnDate } = req.body;

    const eq = await Equipment.findById(equipment).session(session);
    if (!eq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Equipment not found." });
    }

    if (!eq.available) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Equipment unvailable." });
    }

    const usr = await User.findById(user).session(session);
    if (!usr) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found." });
    }

    const start = new Date(rentalDate);
    const end = new Date(returnDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((end - start) / msPerDay) || 1;
    const cost = days * eq.pricePerDay;

    eq.available = false;
    await eq.save({ session });

    const rental = new Rental({
      user,
      equipment,
      rentalDate,
      returnDate,
      returned: false,
      cost,
    });
    const savedRental = await rental.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedRental);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Transaction-based return
const returnRental = async (req, res) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const rental = await Rental.findById(id).session(session);
    if (!rental) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Rental not found." });
    }

    if (rental.returned) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Equipment already returned." });
    }

    const eq = await Equipment.findById(rental.equipment).session(session);
    if (!eq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Equipment not found." });
    }

    rental.returned = true;
    await rental.save({ session });

    eq.available = true;
    await eq.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Equipment returned correctly.", rental });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Create a report of rentals by user ID
const getRentalsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rentals = await Rental.find({ user: userId })
      .populate("user", "name email")
      .populate("equipment", "name type available");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new rental
const createRental = async (req, res) => {
  try {
    const { user, equipment, rentalDate, returnDate, returned } = req.body;
    const rental = new Rental({ user, equipment, rentalDate, returnDate, returned });
    const saved = await rental.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a list of all rentals
const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate("user", "name email").populate("equipment", "name type available");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get rental by ID
const getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("user", "name email")
      .populate("equipment", "name type");
    if (!rental) return res.status(404).json({ error: "Wypożyczenie nie znalezione" });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update rental data by ID
const updateRental = async (req, res) => {
  try {
    const { user, equipment, rentalDate, returnDate, returned } = req.body;
    const updated = await Rental.findByIdAndUpdate(
      req.params.id,
      { user, equipment, rentalDate, returnDate, returned },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Wypożyczenie nie znalezione" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete rental by ID
const deleteRental = async (req, res) => {
  try {
    const deleted = await Rental.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Wypożyczenie nie znalezione" });
    res.json({ message: "Wypożyczenie usunięte" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  rentEquipment,
  returnRental,
  getRentalsByUser,
  createRental,
  getRentals,
  getRentalById,
  updateRental,
  deleteRental,
};
