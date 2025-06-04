const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Upewnij się, że "ski-rental" to NAZWA TWOJEJ BAZY DANYCH
    await mongoose.connect("mongodb://127.0.0.1:27017/ski-rental?replicaSet=rs0");
    console.log("✅ Połączono z MongoDB");
  } catch (error) {
    console.error("❌ Błąd połączenia z MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
