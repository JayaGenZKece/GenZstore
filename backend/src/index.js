// src/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes    = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const orderRoutes   = require('./routes/orders');
const userRoutes    = require('./routes/users');
const adminRoutes   = require('./routes/admin');
const uploadRoutes  = require('./routes/upload');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /\.vercel\.app$/,           // semua subdomain vercel
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting – 100 req/15 menit per IP
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Terlalu banyak request, coba lagi nanti.' },
}));

// ── Routes ──────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '🎮 MLShop API v1.0', status: 'OK' }));

app.use('/api/auth',     authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/upload',   uploadRoutes);

// ── 404 & Error Handler ─────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route tidak ditemukan' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
