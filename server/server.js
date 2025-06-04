const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();      // Wczytaj zmienne środowiskowe z .env
connectDB();          // Połącz z MongoDB

const app = express();

app.use(cors());          // Zezwól na zapytania z frontu (np. React)
app.use(express.json());  // Middleware do parsowania JSON w ciele requestów

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Prosty endpoint testowy
app.get('/', (req, res) => {
  res.send('API działa!');
});

const equipmentRoutes = require('./routes/equipmentRoutes');
app.use('/api/equipment', equipmentRoutes);

const rentalRoutes = require('./routes/rentalRoutes');
app.use('/api/rentals', rentalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serwer działa na porcie ${PORT}`);
});
