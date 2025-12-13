import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WorkoutChart = () => {
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    notes: ''
  });

  // Sample workout data
  const sampleWorkouts = [
    {
      date: '2024-12-10',
      exercise: 'Bench Press',
      sets: 4,
      reps: 8,
      weight: 185,
      duration: 45,
      notes: 'Good form, felt strong'
    },
    {
      date: '2024-12-10',
      exercise: 'Squats',
      sets: 4,
      reps: 10,
      weight: 225,
      duration: 50,
      notes: 'Increased weight from last week'
    },
    {
      date: '2024-12-12',
      exercise: 'Deadlift',
      sets: 3,
      reps: 6,
      weight: 275,
      duration: 40,
      notes: 'Personal record!'
    },
    {
      date: '2024-12-12',
      exercise: 'Pull-ups',
      sets: 3,
      reps: 12,
      weight: 0,
      duration: 20,
      notes: 'Bodyweight only'
    }
  ];

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workoutData');
    if (savedWorkouts) {
      setWorkoutData(JSON.parse(savedWorkouts));
    } else {
      setWorkoutData(sampleWorkouts);
      localStorage.setItem('workoutData', JSON.stringify(sampleWorkouts));
    }
  }, []);

  const handleAddWorkout = (e) => {
    e.preventDefault();
    
    if (!newWorkout.exercise || !newWorkout.sets || !newWorkout.reps) {
      toast.error('Please fill in required fields');
      return;
    }

    const workout = {
      ...newWorkout,
      sets: parseInt(newWorkout.sets),
      reps: parseInt(newWorkout.reps),
      weight: parseFloat(newWorkout.weight) || 0,
      duration: parseInt(newWorkout.duration) || 0,
      id: Date.now()
    };

    const updatedWorkouts = [...workoutData, workout];
    setWorkoutData(updatedWorkouts);
    localStorage.setItem('workoutData', JSON.stringify(updatedWorkouts));
    
    setNewWorkout({
      date: new Date().toISOString().split('T')[0],
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      notes: ''
    });
    
    toast.success('Workout added successfully!');
  };

  const getWeeklyData = () => {
    const weeks = [];
    const sortedWorkouts = [...workoutData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedWorkouts.length === 0) return weeks;

    let currentWeek = [];
    let currentWeekStart = null;

    sortedWorkouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      const weekStart = new Date(workoutDate);
      weekStart.setDate(workoutDate.getDate() - workoutDate.getDay());
      
      if (!currentWeekStart || weekStart.getTime() !== currentWeekStart.getTime()) {
        if (currentWeek.length > 0) {
          weeks.push({
            weekStart: currentWeekStart,
            workouts: currentWeek
          });
        }
        currentWeek = [workout];
        currentWeekStart = weekStart;
      } else {
        currentWeek.push(workout);
      }
    });

    if (currentWeek.length > 0) {
      weeks.push({
        weekStart: currentWeekStart,
        workouts: currentWeek
      });
    }

    return weeks;
  };

  const getExerciseProgress = (exerciseName) => {
    const exerciseWorkouts = workoutData
      .filter(w => w.exercise.toLowerCase() === exerciseName.toLowerCase())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return exerciseWorkouts.map(workout => ({
      date: workout.date,
      maxWeight: workout.weight,
      totalVolume: workout.sets * workout.reps * (workout.weight || 1)
    }));
  };

  const weeklyData = getWeeklyData();
  const currentWeekData = weeklyData[selectedWeek] || { workouts: [] };

  const uniqueExercises = [...new Set(workoutData.map(w => w.exercise))];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Workout Chart</h1>
        <p className="text-gray-600 text-center">Track your progress and plan your workouts</p>
      </div>

      {/* Add New Workout Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Log New Workout</h2>
        <form onSubmit={handleAddWorkout} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={newWorkout.date}
              onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Exercise</label>
            <input
              type="text"
              value={newWorkout.exercise}
              onChange={(e) => setNewWorkout({...newWorkout, exercise: e.target.value})}
              placeholder="e.g., Bench Press"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sets</label>
            <input
              type="number"
              value={newWorkout.sets}
              onChange={(e) => setNewWorkout({...newWorkout, sets: e.target.value})}
              placeholder="4"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reps</label>
            <input
              type="number"
              value={newWorkout.reps}
              onChange={(e) => setNewWorkout({...newWorkout, reps: e.target.value})}
              placeholder="8"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              value={newWorkout.weight}
              onChange={(e) => setNewWorkout({...newWorkout, weight: e.target.value})}
              placeholder="185"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Duration (min)</label>
            <input
              type="number"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
              placeholder="45"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Add Workout
            </button>
          </div>
        </form>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={newWorkout.notes}
            onChange={(e) => setNewWorkout({...newWorkout, notes: e.target.value})}
            placeholder="How did it feel? Any observations?"
            className="w-full p-2 border rounded-md"
            rows="2"
          />
        </div>
      </div>

      {/* Weekly View */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Weekly Progress</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
              disabled={selectedWeek === 0}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-md"
            >
              Previous Week
            </button>
            <button
              onClick={() => setSelectedWeek(Math.min(weeklyData.length - 1, selectedWeek + 1))}
              disabled={selectedWeek >= weeklyData.length - 1}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-md"
            >
              Next Week
            </button>
          </div>
        </div>

        {currentWeekData.workouts.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Week of {currentWeekData.weekStart?.toLocaleDateString()}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Date</th>
                    <th className="border border-gray-300 p-3 text-left">Exercise</th>
                    <th className="border border-gray-300 p-3 text-left">Sets x Reps</th>
                    <th className="border border-gray-300 p-3 text-left">Weight</th>
                    <th className="border border-gray-300 p-3 text-left">Volume</th>
                    <th className="border border-gray-300 p-3 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWeekData.workouts.map((workout, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">
                        {new Date(workout.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 p-3 font-medium">{workout.exercise}</td>
                      <td className="border border-gray-300 p-3">{workout.sets} x {workout.reps}</td>
                      <td className="border border-gray-300 p-3">
                        {workout.weight ? `${workout.weight} lbs` : 'Bodyweight'}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {(workout.sets * workout.reps * (workout.weight || 1)).toLocaleString()} lbs
                      </td>
                      <td className="border border-gray-300 p-3 text-sm text-gray-600">
                        {workout.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No workouts recorded for this week</p>
        )}
      </div>

      {/* Exercise Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Exercise Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueExercises.slice(0, 6).map(exercise => {
            const progress = getExerciseProgress(exercise);
            const latestWorkout = progress[progress.length - 1];
            const firstWorkout = progress[0];
            const improvement = latestWorkout && firstWorkout ? 
              ((latestWorkout.maxWeight - firstWorkout.maxWeight) / firstWorkout.maxWeight * 100).toFixed(1) : 0;

            return (
              <div key={exercise} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{exercise}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Max:</span>
                    <span className="font-medium">
                      {latestWorkout ? `${latestWorkout.maxWeight} lbs` : 'No data'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sessions:</span>
                    <span className="font-medium">{progress.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Improvement:</span>
                    <span className={`font-medium ${improvement > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {improvement > 0 ? `+${improvement}%` : 'No change'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutChart;