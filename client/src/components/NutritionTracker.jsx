import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../utils/fetchData';
const NutritionTracker = () => {
    const { auth } = useAuth();
    const [foods, setFoods] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState(100);
    const [dailyLog, setDailyLog] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [loading, setLoading] = useState(false);
    const [nutritionEntryId, setNutritionEntryId] = useState(null);

    // Mock food database
    const foodDatabase = [
        { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, per: 100 },
        { id: 2, name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, per: 100 },
        { id: 3, name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, per: 100 },
        { id: 4, name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 12, per: 100 },
        { id: 5, name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, per: 100 },
        { id: 6, name: 'Oats', calories: 389, protein: 17, carbs: 66, fat: 7, per: 100 },
        { id: 7, name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, per: 100 },
        { id: 8, name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, per: 100 }
    ];

    useEffect(() => {
        if (searchTerm) {
            const filtered = foodDatabase.filter(food =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFoods(filtered);
        } else {
            setFoods([]);
        }
    }, [searchTerm]);

    // Load today's nutrition data on component mount
    useEffect(() => {
        if (auth?.token) {
            testNutritionAPI();
            fetchTodayNutrition();
        }
    }, [auth?.token]);

    // Test API connection
    const testNutritionAPI = async () => {
        try {
            console.log('Testing nutrition API connection...');
            const response = await axios.get(`${BASE_URL}/api/v1/nutrition/test`);
            console.log('API test successful:', response.data);
        } catch (error) {
            console.error('API test failed:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
        }
    };

    useEffect(() => {
        const calories = dailyLog.reduce((sum, item) => sum + item.calories, 0);
        const protein = dailyLog.reduce((sum, item) => sum + item.protein, 0);
        const carbs = dailyLog.reduce((sum, item) => sum + item.carbs, 0);
        const fat = dailyLog.reduce((sum, item) => sum + item.fat, 0);

        setTotalCalories(Math.round(calories));
        setTotalProtein(Math.round(protein * 10) / 10);
        setTotalCarbs(Math.round(carbs * 10) / 10);
        setTotalFat(Math.round(fat * 10) / 10);
    }, [dailyLog]);

    // API Functions
    const fetchTodayNutrition = async () => {
        try {
            setLoading(true);
            console.log('Fetching today\'s nutrition...');
            
            const response = await axios.get(`${BASE_URL}/api/v1/nutrition/today`);
            console.log('Fetch response:', response.data);
            
            if (response.data.success && response.data.data) {
                const data = response.data.data;
                setDailyLog(data.foods || []);
                setTotalCalories(data.totalCalories || 0);
                setTotalProtein(data.totalProtein || 0);
                setTotalCarbs(data.totalCarbs || 0);
                setTotalFat(data.totalFat || 0);
                setNutritionEntryId(data._id);
                console.log('Today\'s nutrition loaded:', data);
            } else {
                console.log('No nutrition data found for today');
                // Reset to empty state
                setDailyLog([]);
                setTotalCalories(0);
                setTotalProtein(0);
                setTotalCarbs(0);
                setTotalFat(0);
                setNutritionEntryId(null);
            }
        } catch (error) {
            console.error('Error fetching today\'s nutrition:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(error.response.data.message || 'Failed to load nutrition data');
            } else {
                toast.error('Network error - please check if server is running');
            }
        } finally {
            setLoading(false);
        }
    };

    const saveNutritionEntry = async (foods) => {
        try {
            console.log('Saving nutrition entry:', { foods, date: new Date().toISOString() });
            
            const response = await axios.post(`${BASE_URL}/api/v1/nutrition/add`, {
                date: new Date().toISOString(),
                foods: foods
            });

            console.log('Save response:', response.data);

            if (response.data.success) {
                setNutritionEntryId(response.data.data._id);
                console.log('Nutrition entry saved successfully:', response.data.data._id);
                return true;
            } else {
                console.error('Save failed:', response.data.message);
                toast.error(response.data.message || 'Failed to save nutrition data');
                return false;
            }
        } catch (error) {
            console.error('Error saving nutrition entry:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error(error.response.data.message || 'Failed to save nutrition data');
            } else {
                toast.error('Network error - please check if server is running');
            }
            return false;
        }
    };

    const addToLog = async () => {
        if (!selectedFood) {
            toast.error('Please select a food item');
            return;
        }

        if (quantity <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        setLoading(true);
        const multiplier = quantity / selectedFood.per;
        const logEntry = {
            id: Date.now(),
            name: selectedFood.name,
            quantity,
            calories: selectedFood.calories * multiplier,
            protein: selectedFood.protein * multiplier,
            carbs: selectedFood.carbs * multiplier,
            fat: selectedFood.fat * multiplier
        };

        // Save to backend
        const success = await saveNutritionEntry([logEntry]);

        if (success) {
            setDailyLog([...dailyLog, logEntry]);
            setSelectedFood(null);
            setSearchTerm('');
            setQuantity(100);
            toast.success('Food added to log');
        }

        setLoading(false);
    };

    const removeFromLog = async (id) => {
        const updatedLog = dailyLog.filter(item => item.id !== id);
        setDailyLog(updatedLog);

        // Update backend with remaining foods
        if (updatedLog.length > 0) {
            await saveNutritionEntry(updatedLog);
        } else {
            // If no foods left, delete the entry
            if (nutritionEntryId) {
                try {
                    await axios.delete(`${BASE_URL}/api/v1/nutrition/entry/${nutritionEntryId}`);
                    setNutritionEntryId(null);
                } catch (error) {
                    console.error('Error deleting nutrition entry:', error);
                }
            }
        }

        toast.success('Food removed from log');
    };

    const clearLog = async () => {
        if (nutritionEntryId) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/nutrition/entry/${nutritionEntryId}`);
                setNutritionEntryId(null);
            } catch (error) {
                console.error('Error clearing nutrition log:', error);
                toast.error('Failed to clear log');
                return;
            }
        }

        setDailyLog([]);
        setTotalCalories(0);
        setTotalProtein(0);
        setTotalCarbs(0);
        setTotalFat(0);
        toast.success('Daily log cleared');
    };

    if (loading && dailyLog.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading nutrition data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Nutrition Tracker</h2>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={fetchTodayNutrition}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        🔄 Refresh
                    </button>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Daily Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Calories</h3>
                    <p className="text-2xl font-bold text-blue-600">{totalCalories}</p>
                    <p className="text-sm text-blue-700">/ 2000 goal</p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Protein</h3>
                    <p className="text-2xl font-bold text-green-600">{totalProtein}g</p>
                    <p className="text-sm text-green-700">/ 150g goal</p>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((totalProtein / 150) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Carbs</h3>
                    <p className="text-2xl font-bold text-yellow-600">{totalCarbs}g</p>
                    <p className="text-sm text-yellow-700">/ 250g goal</p>
                    <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((totalCarbs / 250) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Fat</h3>
                    <p className="text-2xl font-bold text-red-600">{totalFat}g</p>
                    <p className="text-sm text-red-700">/ 65g goal</p>
                    <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((totalFat / 65) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Food Search and Add */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Add Food</h3>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search for food..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Quantity (g)"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={addToLog}
                        disabled={loading || !selectedFood}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Adding...
                            </>
                        ) : (
                            'Add'
                        )}
                    </button>
                </div>

                {/* Food Search Results */}
                {foods.length > 0 && (
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                        {foods.map(food => (
                            <div
                                key={food.id}
                                onClick={() => setSelectedFood(food)}
                                className={`p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${selectedFood?.id === food.id ? 'bg-blue-100' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{food.name}</span>
                                    <span className="text-sm text-gray-600">
                                        {food.calories} cal per {food.per}g
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Daily Log */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Today's Log</h3>
                    {dailyLog.length > 0 && (
                        <button
                            onClick={clearLog}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {dailyLog.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No foods logged today</p>
                ) : (
                    <div className="space-y-3">
                        {dailyLog.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-600">{item.quantity}g</p>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {Math.round(item.calories)} cal | P: {Math.round(item.protein * 10) / 10}g |
                                            C: {Math.round(item.carbs * 10) / 10}g | F: {Math.round(item.fat * 10) / 10}g
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromLog(item.id)}
                                        className="text-red-600 hover:text-red-800 ml-4"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NutritionTracker;