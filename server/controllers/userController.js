import User from "../models/User.js";

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    // Only include phone if it's not empty
    const userData = { name, email };
    if (phone && phone.trim() !== "") {
      userData.phone = phone.trim();
    }
    const user = new User(userData);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a list of all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user data by ID
const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    // Only include phone if it's not empty
    const updateData = { name, email };
    if (phone && phone.trim() !== "") {
      updateData.phone = phone.trim();
    } else {
      // If phone is empty, remove it from the document
      updateData.$unset = { phone: "" };
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found." });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found." });
    res.json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
