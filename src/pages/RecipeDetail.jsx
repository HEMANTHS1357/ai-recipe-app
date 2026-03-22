import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, ChefHat, ArrowLeft, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { getSavedRecipes, deleteRecipe } from '../services/api';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [checkedIngredients, setCheckedIngredients] = useState(new Set());

    useEffect(() => {
        loadRecipe();
    }, [id]);

    const loadRecipe = async () => {
        try {
            const res = await getSavedRecipes();
            const found = res.data.find(r => r._id === id);
            if (found) {
                setRecipe(found);
            } else {
                toast.error('Recipe not found');
                navigate('/recipes');
            }
        } catch (err) {
            toast.error('Failed to load recipe');
            navigate('/recipes');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this recipe?')) return;
        try {
            await deleteRecipe(id);
            toast.success('Recipe deleted');
            navigate('/recipes');
        } catch (err) {
            toast.error('Failed to delete recipe');
        }
    };

    const toggleIngredient = (index) => {
        const newChecked = new Set(checkedIngredients);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedIngredients(newChecked);
    };

    if (!recipe) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/recipes" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Recipes
                </Link>

                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                        </div>
                        <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {recipe.cuisine && (
                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">{recipe.cuisine}</span>
                        )}
                        {recipe.difficulty && (
                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {recipe.difficulty}
                            </span>
                        )}
                        {recipe.dietaryInfo?.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{tag}</span>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">{recipe.cookingTime}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
                            <div className="space-y-3">
                                {recipe.ingredients?.map((ingredient, index) => {
                                    const isChecked = checkedIngredients.has(index);
                                    return (
                                        <label key={index} className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleIngredient(index)}
                                                className="mt-1 w-4 h-4 text-emerald-500 border-gray-300 rounded"
                                            />
                                            <span className={`flex-1 ${isChecked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {ingredient}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
                            <ol className="space-y-4">
                                {recipe.instructions?.map((step, index) => (
                                    <li key={index} className="flex gap-4">
                                        <span className="shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <p className="text-gray-700 pt-1 flex-1">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {recipe.nutritionInfo && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Nutrition (per serving)</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <NutritionCard label="Calories" value={recipe.nutritionInfo.calories} />
                                    <NutritionCard label="Protein" value={recipe.nutritionInfo.protein} />
                                    <NutritionCard label="Carbs" value={recipe.nutritionInfo.carbs} />
                                    <NutritionCard label="Fat" value={recipe.nutritionInfo.fat} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NutritionCard = ({ label, value }) => (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
);

export default RecipeDetail;