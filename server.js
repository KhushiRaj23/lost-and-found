const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lost-found-portal';
console.log('Connecting to MongoDB...');
console.log('Target:', mongoUri.includes('localhost') ? 'Local' : 'Atlas');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  console.log('Database:', mongoUri.includes('localhost') ? 'Local' : 'Atlas');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/moderators', require('./routes/moderators'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Notification simulation endpoint
app.post('/api/notifications', (req, res) => {
  const { message, type } = req.body;
  console.log(`NOTIFICATION [${type}]: ${message}`);
  res.json({ success: true, message: 'Notification logged' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
