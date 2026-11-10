require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const lapanganRoutes = require('./routes/lapanganRoutes');
const venueRoutes = require('./routes/venueRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URI;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.send('Server Express.js berjalan!');
});

// ---------- Route per modul ----------
app.use('/lapangan', lapanganRoutes);
app.use('/venue', venueRoutes);

// ---------- Handler 404 dan error handler (paling bawah) ----------
app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Terhubung ke MongoDB');
    console.log('Database aktif:', mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Gagal terhubung:', err.message);
    process.exit(1);
  });