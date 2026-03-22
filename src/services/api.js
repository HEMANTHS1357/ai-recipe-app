import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Pantry APIs
export const getPantryItems = () => api.get('/pantry');
export const addPantryItem = (item) => api.post('/pantry', item);
export const updatePantryItem = (id, item) => api.put(`/pantry/${id}`, item);
export const deletePantryItem = (id) => api.delete(`/pantry/${id}`);

// Recipe APIs
export const generateRecipe = (data) => api.post('/recipes/generate', data);
export const saveRecipe = (recipe) => api.post('/recipes/save', recipe);
export const getSavedRecipes = () => api.get('/recipes/saved');
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);

export default api;