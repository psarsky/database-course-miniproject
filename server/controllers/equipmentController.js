const Equipment = require('../models/Equipment');

const createEquipment = async (req, res) => {
  try {
    const { name, type, available } = req.body;
    const equipment = new Equipment({ name, type, available });
    const saved = await equipment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEquipments = async (req, res) => {
  try {
    const list = await Equipment.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEquipmentById = async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Sprzęt nie znaleziony' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { name, type, available } = req.body;
    const updated = await Equipment.findByIdAndUpdate(
      req.params.id,
      { name, type, available },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Sprzęt nie znaleziony' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Sprzęt nie znaleziony' });
    res.json({ message: 'Sprzęt usunięty' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEquipment,
  getEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
};
