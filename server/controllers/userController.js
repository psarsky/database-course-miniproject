const User = require("../models/User");

// Utwórz użytkownika
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobierz wszystkich użytkowników
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobierz użytkownika po ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aktualizuj użytkownika
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true } // zwróć zaktualizowany dokument
    );
    if (!updatedUser) return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Usuń użytkownika
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    res.json({ message: "Użytkownik usunięty" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
