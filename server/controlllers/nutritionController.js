import NutritionEntry from '../models/NutritionEntry.js';

// Add nutrition entry
export const addNutritionEntry = async (req, res) => {
  try {
    const { date, foods } = req.body;
    const userId = req.user._id;

    // Validation
    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Foods array is required and cannot be empty'
      });
    }

    console.log('Adding nutrition entry for user:', userId, 'date:', date, 'foods count:', foods.length);

    // Calculate totals
    const totals = foods.reduce((acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Check if entry exists for this date
    const inputDate = new Date(date);
    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingEntry = await NutritionEntry.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingEntry) {
      // Update existing entry
      console.log('Updating existing entry:', existingEntry._id);
      existingEntry.foods.push(...foods);
      existingEntry.totalCalories += totals.calories;
      existingEntry.totalProtein += totals.protein;
      existingEntry.totalCarbs += totals.carbs;
      existingEntry.totalFat += totals.fat;
      
      const savedEntry = await existingEntry.save();
      console.log('Entry updated successfully:', savedEntry._id);
      
      res.status(200).json({
        success: true,
        message: 'Nutrition entry updated successfully',
        data: savedEntry
      });
    } else {
      // Create new entry
      console.log('Creating new nutrition entry');
      const nutritionEntry = new NutritionEntry({
        userId,
        date: startOfDay, // Use start of day for consistent date storage
        foods,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat
      });

      const savedEntry = await nutritionEntry.save();
      console.log('New entry created successfully:', savedEntry._id);
      
      res.status(201).json({
        success: true,
        message: 'Nutrition entry added successfully',
        data: savedEntry
      });
    }
  } catch (error) {
    console.error('Error adding nutrition entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding nutrition entry',
      error: error.message
    });
  }
};

// Get nutrition entries by date range
export const getNutritionEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, limit = 30 } = req.query;

    let query = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const entries = await NutritionEntry.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nutrition entries',
      error: error.message
    });
  }
};

// Get today's nutrition
export const getTodayNutrition = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entry = await NutritionEntry.findOne({
      userId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.status(200).json({
      success: true,
      data: entry || {
        foods: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s nutrition',
      error: error.message
    });
  }
};

// Delete nutrition entry
export const deleteNutritionEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const entry = await NutritionEntry.findOneAndDelete({
      _id: id,
      userId
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Nutrition entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting nutrition entry',
      error: error.message
    });
  }
};

// Test endpoint
export const testNutrition = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Test nutrition endpoint called by user:', userId);
    
    res.status(200).json({
      success: true,
      message: 'Nutrition API is working',
      user: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error in test endpoint',
      error: error.message
    });
  }
};

// Get nutrition statistics
export const getNutritionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const entries = await NutritionEntry.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const stats = {
      totalDays: entries.length,
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      dailyBreakdown: entries.map(entry => ({
        date: entry.date,
        calories: entry.totalCalories,
        protein: entry.totalProtein,
        carbs: entry.totalCarbs,
        fat: entry.totalFat
      }))
    };

    if (entries.length > 0) {
      stats.averageCalories = Math.round(entries.reduce((sum, entry) => sum + entry.totalCalories, 0) / entries.length);
      stats.averageProtein = Math.round((entries.reduce((sum, entry) => sum + entry.totalProtein, 0) / entries.length) * 10) / 10;
      stats.averageCarbs = Math.round((entries.reduce((sum, entry) => sum + entry.totalCarbs, 0) / entries.length) * 10) / 10;
      stats.averageFat = Math.round((entries.reduce((sum, entry) => sum + entry.totalFat, 0) / entries.length) * 10) / 10;
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nutrition statistics',
      error: error.message
    });
  }
};