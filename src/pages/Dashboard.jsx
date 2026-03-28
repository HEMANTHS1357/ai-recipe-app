import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChefHat, UtensilsCrossed, Clock } from 'lucide-react';
import { getSavedRecipes, getPantryItems } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRecipes: 0,
        pantryItems: 0,
    });
    const [recentRecipes, setRecentRecipes] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [recipesRes, pantryRes] = await Promise.all([
                getSavedRecipes(),
                getPantryItems()
            ]);
            const recipes = Array.isArray(recipesRes.data) ? recipesRes.data : [];
            const pantry = Array.isArray(pantryRes.data) ? pantryRes.data : [];
            setStats({
                totalRecipes: recipes.length,
                pantryItems: pantry.length,
            });
            setRecentRecipes(recipes.slice(0, 5));
        } catch (err) {
            console.error('Failed to load dashboard data');
            setRecentRecipes([]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your cooking overview</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <StatCard
                        icon={<ChefHat className="w-6 h-6" />}
                        label="Total Recipes"
                        value={stats.totalRecipes}
                        color="emerald"
                    />
                    <StatCard
                        icon={<UtensilsCrossed className="w-6 h-6" />}
                        label="Pantry Items"
                        value={stats.pantryItems}
                        color="blue"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link to="/generate"
                        className="bg-emerald-50 text-emerald-500 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Generate Recipe</h3>
                                <p className="text-emerald-800 text-sm">Create AI-powered recipes</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/pantry"
                        className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">Manage Pantry</h3>
                                <p className="text-gray-600 text-sm">Add and track ingredients</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Recipes</h2>
                        <Link to="/recipes" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                            View all
                        </Link>
                    </div>

                    {recentRecipes.length > 0 ? (
                        <div className="space-y-3">
                            {recentRecipes.map((recipe) => (
                                <Link
                                    key={recipe._id}
                                    to={`/recipes/${recipe._id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <ChefHat className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{recipe.title}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {recipe.cookingTime}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No recipes yet. Generate your first one!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;