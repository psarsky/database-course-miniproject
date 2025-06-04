const express = require('express');
const router = express.Router();

const {
  createRental,
  getRentals,
  getRentalById,
  updateRental,
  deleteRental,
  rentEquipment,
  returnRental // ⬅️ dodana funkcja zwrotu
} = require('../controllers/rentalController');

// Wypożyczenie sprzętu z transakcją
router.post('/rent', rentEquipment);

// Zwrot sprzętu
router.post('/:id/return', returnRental);

// Standardowe CRUD
router.post('/', createRental);
router.get('/', getRentals);
router.get('/:id', getRentalById);
router.put('/:id', updateRental);
router.delete('/:id', deleteRental);

module.exports = router;
