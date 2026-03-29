const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const axios = require('axios');

// Generate recipe using Groq AI
router.post('/generate', async (req, res) => {
  try {
    const { ingredients, dietary, cuisine } = req.body;

    const prompt = `Generate a detailed recipe using these ingredients: ${ingredients.join(', ')}.
    ${dietary ? `Dietary preference: ${dietary}` : ''}
    ${cuisine ? `Cuisine type: ${cuisine}` : ''}
    
    Respond in this exact JSON format with no extra text:
    {
      "title": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "cuisine": "cuisine type",
      "difficulty": "Easy",
      "cookingTime": "30 minutes",
      "dietaryInfo": ["vegetarian"],
      "nutritionInfo": {
        "calories": "300 kcal",
        "protein": "20g",
        "carbs": "30g",
        "fat": "10g"
      }
    }`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rawText = response.data.choices[0].message.content;
    console.log('Groq response:', rawText);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const recipeData = JSON.parse(jsonMatch[0]);

    res.json(recipeData);
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate recipe', error: err.response?.data || err.message });
  }
});

// Save a recipe
router.post('/save', async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body, saved: true });
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all saved recipes
router.get('/saved', async (req, res) => {
  try {
    const recipes = await Recipe.find({ saved: true }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a saved recipe
router.delete('/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
