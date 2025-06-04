require("dotenv").config(); // Wczytaj zmienne środowiskowe z .env
const express = require("express");
const mongoose = require("mongoose"); // Mongoose do połączenia z MongoDB
const cors = require("cors");

const app = express();

// --- Middleware ---
app.use(cors()); // Zezwól na zapytania z frontu (np. React)
app.use(express.json()); // Middleware do parsowania JSON w ciele requestów

// --- Import i użycie routów ---
// Upewnij się, że pliki w './routes/' istnieją i są poprawne
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const equipmentRoutes = require('./routes/equipmentRoutes');
app.use('/api/equipment', equipmentRoutes);

const rentalRoutes = require('./routes/rentalRoutes');
app.use('/api/rentals', rentalRoutes);

// --- Główny endpoint testowy ---
app.get("/", (req, res) => {
  res.send("Ski rental backend is running!");
});

// --- Połącz z MongoDB i uruchom serwer ---
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const port = process.env.PORT || 5000; // Użyj portu z .env lub domyślnego 5000

    console.log("Attempting to connect to MongoDB with URI:", mongoUri);
    await mongoose.connect(mongoUri); // Połącz z MongoDB za pomocą Mongoose

    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // Tutaj możesz dodać logikę do ponownej próby połączenia lub eleganckiego zamknięcia aplikacji
    process.exit(1); // Opcjonalnie: zakończ proces aplikacji, jeśli nie udało się połączyć z DB
  }
};

startServer(); // Wywołaj funkcję startową