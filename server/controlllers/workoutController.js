import WorkoutEntry from '../models/WorkoutEntry.js';

// Add workout entry
export const addWorkoutEntry = async (req, res) => {
  try {
    const { date, exercise, sets, reps, weight, duration, notes, category } = req.body;
    const userId = req.user._id;

    const workoutEntry = new WorkoutEntry({
      userId,
      date: new Date(date),
      exercise,
      sets,
      reps,
      weight: weight || 0,
      duration: duration || 0,
      notes: notes || '',
      category: category || 'other'
    });

    await workoutEntry.save();
    
    res.status(201).json({
      success: true,
      message: 'Workout entry added successfully',
      data: workoutEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding workout entry',
      error: error.message
    });
  }
};

// Get workout entries
export const getWorkoutEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, exercise, category, limit = 50 } = req.query;

    let query = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (exercise) {
      query.exercise = new RegExp(exercise, 'i');
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const entries = await WorkoutEntry.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workout entries',
      error: error.message
    });
  }
};

// Get workout statistics
export const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const entries = await WorkoutEntry.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Group by exercise for progress tracking
    const exerciseProgress = {};
    entries.forEach(entry => {
      if (!exerciseProgress[entry.exercise]) {
        exerciseProgress[entry.exercise] = [];
      }
      exerciseProgress[entry.exercise].push({
        date: entry.date,
        weight: entry.weight,
        volume: entry.sets * entry.reps * (entry.weight || 1),
        sets: entry.sets,
        reps: entry.reps
      });
    });

    // Calculate weekly breakdown
    const weeklyData = {};
    entries.forEach(entry => {
      const weekStart = new Date(entry.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          weekStart: weekStart,
          workouts: [],
          totalVolume: 0,
          totalDuration: 0
        };
      }
      
      weeklyData[weekKey].workouts.push(entry);
      weeklyData[weekKey].totalVolume += entry.sets * entry.reps * (entry.weight || 1);
      weeklyData[weekKey].totalDuration += entry.duration || 0;
    });

    const stats = {
      totalWorkouts: entries.length,
      totalVolume: entries.reduce((sum, entry) => sum + (entry.sets * entry.reps * (entry.weight || 1)), 0),
      totalDuration: entries.reduce((sum, entry) => sum + (entry.duration || 0), 0),
      uniqueExercises: [...new Set(entries.map(entry => entry.exercise))].length,
      exerciseProgress,
      weeklyBreakdown: Object.values(weeklyData).sort((a, b) => a.weekStart - b.weekStart),
      categoryBreakdown: entries.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + 1;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workout statistics',
      error: error.message
    });
  }
};

// Get exercise progress
export const getExerciseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { exercise } = req.params;
    const { limit = 20 } = req.query;

    const entries = await WorkoutEntry.find({
      userId,
      exercise: new RegExp(exercise, 'i')
    })
    .sort({ date: 1 })
    .limit(parseInt(limit));

    const progress = entries.map(entry => ({
      date: entry.date,
      weight: entry.weight,
      sets: entry.sets,
      reps: entry.reps,
      volume: entry.sets * entry.reps * (entry.weight || 1),
      notes: entry.notes
    }));

    res.status(200).json({
      success: true,
      data: {
        exercise,
        totalSessions: entries.length,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exercise progress',
      error: error.message
    });
  }
};

// Update workout entry
export const updateWorkoutEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const entry = await WorkoutEntry.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Workout entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workout entry updated successfully',
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating workout entry',
      error: error.message
    });
  }
};

// Delete workout entry
export const deleteWorkoutEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const entry = await WorkoutEntry.findOneAndDelete({
      _id: id,
      userId
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Workout entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workout entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting workout entry',
      error: error.message
    });
  }
};