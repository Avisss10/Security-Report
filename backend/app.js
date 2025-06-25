// app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import laporanRoutes from './routes/laporanRoutes.js';
// Optional: jika kamu punya ini
import userRoutes from './routes/userRoutes.js';
import cabangRoutes from './routes/cabangRoutes.js';

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // akses file foto

// 📌 Routes
app.use('/api/auth', authRoutes);
app.use('/api/laporan', laporanRoutes);

// Admin only (optional if dipakai)
app.use('/api/user', userRoutes);
app.use('/api/cabang', cabangRoutes);

// 🚀 Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
