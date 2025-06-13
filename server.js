import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import expenseRoutes from './routes/expenses.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

console.log("🟡 Connecting to MongoDB...");

mongoose.connect('mongodb://127.0.0.1:27017/React', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');

  // Only start server AFTER DB is connected
  app.use('/api/auth', authRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/expenses', expenseRoutes);

  app.get('/', (req, res) => {
    res.send('Welcome to the Room Expense Splitter API');
  });

  process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  });


  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });

    app.use((err, req, res, next) => {
      console.error("💥 Uncaught error:", err.stack);
      res.status(500).json({ message: "Server crashed" });
  });


}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
