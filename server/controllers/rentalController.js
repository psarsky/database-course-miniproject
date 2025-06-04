const Rental = require('../models/Rental');
const Equipment = require('../models/Equipment');
const mongoose = require('mongoose');

// Wypożyczenie sprzętu z transakcją
const rentEquipment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user, equipment, rentalDate, returnDate } = req.body;

    const eq = await Equipment.findById(equipment).session(session);
    if (!eq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Sprzęt nie znaleziony' });
    }

    if (!eq.available) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Sprzęt niedostępny' });
    }

    eq.available = false;
    await eq.save({ session });

    const rental = new Rental({
      user,
      equipment,
      rentalDate,
      returnDate,
      returned: false
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

// Zwrot sprzętu z transakcją
const returnRental = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const rental = await Rental.findById(id).session(session);
    if (!rental) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Wypożyczenie nie znalezione' });
    }

    if (rental.returned) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Sprzęt już został zwrócony' });
    }

    const eq = await Equipment.findById(rental.equipment).session(session);
    if (!eq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Sprzęt nie znaleziony' });
    }

    rental.returned = true;
    await rental.save({ session });

    eq.available = true;
    await eq.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Sprzęt zwrócony pomyślnie', rental });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// CRUD

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

const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'name email')
      .populate('equipment', 'name type available');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('user', 'name email')
      .populate('equipment', 'name type');
    if (!rental) return res.status(404).json({ error: 'Wypożyczenie nie znalezione' });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRental = async (req, res) => {
  try {
    const { user, equipment, rentalDate, returnDate, returned } = req.body;
    const updated = await Rental.findByIdAndUpdate(
      req.params.id,
      { user, equipment, rentalDate, returnDate, returned },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Wypożyczenie nie znalezione' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRental = async (req, res) => {
  try {
    const deleted = await Rental.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Wypożyczenie nie znalezione' });
    res.json({ message: 'Wypożyczenie usunięte' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eksport funkcji
module.exports = {
  createRental,
  getRentals,
  getRentalById,
  updateRental,
  deleteRental,
  rentEquipment,
  returnRental
};
