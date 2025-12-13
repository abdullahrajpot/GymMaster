import express from 'express';
import {
  addWorkoutEntry,
  getWorkoutEntries,
  getWorkoutStats,
  getExerciseProgress,
  updateWorkoutEntry,
  deleteWorkoutEntry
} from '../controlllers/workoutController.js';
import { requireSignIn } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Add workout entry
router.post('/add', requireSignIn, addWorkoutEntry);

// Get workout entries
router.get('/entries', requireSignIn, getWorkoutEntries);

// Get workout statistics
router.get('/stats', requireSignIn, getWorkoutStats);

// Get exercise progress
router.get('/exercise/:exercise/progress', requireSignIn, getExerciseProgress);

// Update workout entry
router.put('/entry/:id', requireSignIn, updateWorkoutEntry);

// Delete workout entry
router.delete('/entry/:id', requireSignIn, deleteWorkoutEntry);

export default router;