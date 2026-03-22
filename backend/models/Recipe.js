const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String
  }],
  instructions: [{
    type: String
  }],
  cuisine: {
    type: String,
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  dietaryInfo: [{
    type: String
  }],
  nutritionInfo: {
    calories: String,
    protein: String,
    carbs: String,
    fat: String
  },
  cookingTime: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);