import Equipment from "../models/Equipment.js";

// Create new equipment
const createEquipment = async (req, res) => {
  try {
    const { name, type, available, pricePerDay } = req.body;
    if (typeof pricePerDay !== "number" || pricePerDay < 0) {
      return res.status(400).json({ error: "Price per day must be a positive number." });
    }
    const equipment = new Equipment({ name, type, available, pricePerDay });
    const saved = await equipment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a list of all equipment
const getEquipments = async (_, res) => {
  try {
    const list = await Equipment.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get equipment by IDb
const getEquipmentById = async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Equipment not found." });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update equipment data by ID
const updateEquipment = async (req, res) => {
  try {
    const { name, type, available, pricePerDay } = req.body;
    const updated = await Equipment.findByIdAndUpdate(
      req.params.id,
      { name, type, available, pricePerDay },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Equipment not found." });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete equipment by ID
const deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Equipment not found." });
    res.json({ message: "Equipment deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createEquipment, getEquipments, getEquipmentById, updateEquipment, deleteEquipment };
