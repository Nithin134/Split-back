import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import compression from 'compression'; 

import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import expenseRoutes from './routes/expenses.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(compression());


app.use(cors({
  origin: "https://splitaaara.netlify.app",
  credentials: true
}));


app.use(express.json());

app.use(express.static("public", {
  setHeaders: (res) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
}));

console.log(" Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://myAtlasDBUser:Sorry.2.kill@myatlasclusteredu.8vpwie9.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(' MongoDB connected');


  app.use('/api/auth', authRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/expenses', expenseRoutes);


  app.get('/', (req, res) => {
    res.send('Welcome to the Room Expense Splitter API ');
  });


  app.use((err, req, res, next) => {
    console.error(" Uncaught error:", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });


  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });

}).catch(err => {
  console.error(' MongoDB connection error:', err);
});
