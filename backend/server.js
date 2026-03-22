require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const pantryRoutes = require('./routes/pantry');
const recipeRoutes = require('./routes/recipe');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err.message));

app.use('/api/pantry', pantryRoutes);
app.use('/api/recipes', recipeRoutes);

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));