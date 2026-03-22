import { useState, useEffect } from 'react';
import { Search, Clock, ChefHat, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { getSavedRecipes, deleteRecipe } from '../services/api';

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [loading, setLoading] = useState(true);

    const cuisines = ['All', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American', 'General'];
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        filterRecipes();
    }, [recipes, searchQuery, selectedCuisine, selectedDifficulty]);

    const fetchRecipes = async () => {
        try {
            const res = await getSavedRecipes();
            setRecipes(res.data);
        } catch (err) {
            toast.error('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    const filterRecipes = () => {
        let filtered = recipes;
        if (searchQuery) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCuisine !== 'All') {
            filtered = filtered.filter(recipe => recipe.cuisine === selectedCuisine);
        }
        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
        }
        setFilteredRecipes(filtered);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this recipe?')) return;
        try {
            await deleteRecipe(id);
            setRecipes(recipes.filter(recipe => recipe._id !== id));
            toast.success('Recipe deleted');
        } catch (err) {
            toast.error('Failed to delete recipe');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
                    <p className="text-gray-600 mt-1">Your collection of saved recipes</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search recipes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                            {cuisines.map(cuisine => (
                                <option key={cuisine} value={cuisine}>{cuisine === 'All' ? 'All Cuisines' : cuisine}</option>
                            ))}
                        </select>
                        <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>{diff === 'All' ? 'All Difficulties' : diff}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600">Showing {filteredRecipes.length} of {recipes.length} recipes</p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe._id} recipe={recipe} onDelete={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                            {recipes.length === 0 ? 'No saved recipes yet' : 'No recipes match your filters'}
                        </p>
                        {recipes.length === 0 && (
                            <Link to="/generate"
                                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                                Generate Your First Recipe
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const RecipeCard = ({ recipe, onDelete }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
        <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-emerald-600" />
        </div>
        <div className="p-5">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-3">
                {recipe.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {recipe.cuisine && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">{recipe.cuisine}</span>
                )}
                {recipe.difficulty && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {recipe.difficulty}
                    </span>
                )}
                {recipe.dietaryInfo?.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">{tag}</span>
                ))}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>{recipe.cookingTime}</span>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Link to={`/recipes/${recipe._id}`}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-center py-2 rounded-lg font-medium transition-colors text-sm">
                    View Recipe
                </Link>
                <button onClick={() => onDelete(recipe._id)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

export default MyRecipes;