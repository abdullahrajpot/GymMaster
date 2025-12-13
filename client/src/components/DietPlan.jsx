import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const DietPlan = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userGoals, setUserGoals] = useState({
    goal: 'maintain', // lose, gain, maintain
    dailyCalories: 2000,
    protein: 150,
    carbs: 200,
    fats: 70
  });

  const sampleDietPlans = [
    {
      id: 1,
      name: "Weight Loss Plan",
      description: "Low calorie, high protein diet for weight loss",
      dailyCalories: 1500,
      meals: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          foods: [
            { name: "Oatmeal", calories: 150, protein: 5, carbs: 30, fats: 3 },
            { name: "Banana", calories: 105, protein: 1, carbs: 27, fats: 0 },
            { name: "Almonds (10)", calories: 70, protein: 3, carbs: 2, fats: 6 }
          ]
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          foods: [
            { name: "Grilled Chicken Breast", calories: 230, protein: 43, carbs: 0, fats: 5 },
            { name: "Brown Rice (1 cup)", calories: 220, protein: 5, carbs: 45, fats: 2 },
            { name: "Broccoli", calories: 55, protein: 4, carbs: 11, fats: 1 }
          ]
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          foods: [
            { name: "Salmon Fillet", calories: 280, protein: 39, carbs: 0, fats: 12 },
            { name: "Sweet Potato", calories: 180, protein: 4, carbs: 41, fats: 0 },
            { name: "Green Salad", calories: 50, protein: 2, carbs: 10, fats: 2 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Muscle Gain Plan",
      description: "High protein, high calorie diet for muscle building",
      dailyCalories: 2800,
      meals: [
        {
          name: "Breakfast",
          time: "7:00 AM",
          foods: [
            { name: "Protein Smoothie", calories: 350, protein: 30, carbs: 40, fats: 8 },
            { name: "Whole Grain Toast (2 slices)", calories: 160, protein: 6, carbs: 30, fats: 2 },
            { name: "Peanut Butter", calories: 190, protein: 8, carbs: 8, fats: 16 }
          ]
        },
        {
          name: "Lunch",
          time: "12:30 PM",
          foods: [
            { name: "Lean Beef", calories: 350, protein: 50, carbs: 0, fats: 15 },
            { name: "Quinoa (1.5 cups)", calories: 330, protein: 12, carbs: 58, fats: 5 },
            { name: "Mixed Vegetables", calories: 80, protein: 3, carbs: 18, fats: 1 }
          ]
        },
        {
          name: "Dinner",
          time: "7:00 PM",
          foods: [
            { name: "Grilled Chicken Thigh", calories: 320, protein: 38, carbs: 0, fats: 17 },
            { name: "Pasta (2 cups)", calories: 440, protein: 16, carbs: 88, fats: 2 },
            { name: "Olive Oil", calories: 120, protein: 0, carbs: 0, fats: 14 }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    setDietPlans(sampleDietPlans);
  }, []);

  const calculateMealTotals = (meal) => {
    return meal.foods.reduce((totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fats: totals.fats + food.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const calculateDayTotals = (plan) => {
    return plan.meals.reduce((dayTotals, meal) => {
      const mealTotals = calculateMealTotals(meal);
      return {
        calories: dayTotals.calories + mealTotals.calories,
        protein: dayTotals.protein + mealTotals.protein,
        carbs: dayTotals.carbs + mealTotals.carbs,
        fats: dayTotals.fats + mealTotals.fats
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    toast.success(`Selected ${plan.name}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Diet Plans</h1>
        <p className="text-gray-600 text-center">Choose a diet plan that matches your fitness goals</p>
      </div>

      {/* Goals Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal</label>
            <select 
              value={userGoals.goal}
              onChange={(e) => setUserGoals({...userGoals, goal: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Daily Calories</label>
            <input 
              type="number" 
              value={userGoals.dailyCalories}
              onChange={(e) => setUserGoals({...userGoals, dailyCalories: parseInt(e.target.value)})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Protein (g)</label>
            <input 
              type="number" 
              value={userGoals.protein}
              onChange={(e) => setUserGoals({...userGoals, protein: parseInt(e.target.value)})}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Carbs (g)</label>
            <input 
              type="number" 
              value={userGoals.carbs}
              onChange={(e) => setUserGoals({...userGoals, carbs: parseInt(e.target.value)})}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Diet Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {dietPlans.map((plan) => {
          const dayTotals = calculateDayTotals(plan);
          return (
            <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="opacity-90">{plan.description}</p>
                <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">{dayTotals.calories}</div>
                    <div className="opacity-80">Calories</div>
                  </div>
                  <div>
                    <div className="font-semibold">{dayTotals.protein}g</div>
                    <div className="opacity-80">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold">{dayTotals.carbs}g</div>
                    <div className="opacity-80">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold">{dayTotals.fats}g</div>
                    <div className="opacity-80">Fats</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {plan.meals.map((meal, mealIndex) => {
                  const mealTotals = calculateMealTotals(meal);
                  return (
                    <div key={mealIndex} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">{meal.name}</h4>
                        <span className="text-sm text-gray-500">{meal.time}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {meal.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                            <span className="font-medium">{food.name}</span>
                            <span className="text-sm text-gray-600">{food.calories} cal</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="font-semibold">{mealTotals.calories}</span>
                            <span className="text-gray-600 ml-1">cal</span>
                          </div>
                          <div>
                            <span className="font-semibold">{mealTotals.protein}g</span>
                            <span className="text-gray-600 ml-1">protein</span>
                          </div>
                          <div>
                            <span className="font-semibold">{mealTotals.carbs}g</span>
                            <span className="text-gray-600 ml-1">carbs</span>
                          </div>
                          <div>
                            <span className="font-semibold">{mealTotals.fats}g</span>
                            <span className="text-gray-600 ml-1">fats</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Select This Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Active Plan: {selectedPlan.name}
          </h3>
          <p className="text-green-700">
            You've selected the {selectedPlan.name}. Start following your meal plan today!
          </p>
        </div>
      )}
    </div>
  );
};

export default DietPlan;