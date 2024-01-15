const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const userRoute = require('./route/userRoute.js');
const bookRoute = require('./route/bookRoute.js');
const app = express();
const corsOptions = {
  origin: '*',
};

const mongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB server started successfully!`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// MIDDLEWARES.
app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON objects.
app.use('/user', userRoute); // User routes.
app.use('/books', bookRoute); // Book routes.

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
});

app.get('/', (req, res) => {
  return res.json('Hello, this is your API!');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  mongo();
  console.log(`Server started on port ${PORT}`);
});
