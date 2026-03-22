const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'pieces'
  },
  expiryDate: {
    type: Date
  },
  category: {
    type: String,
    default: 'Other'
  },
  lowStock: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Pantry', pantrySchema);