import express from 'express';
import {
  addNutritionEntry,
  getNutritionEntries,
  getTodayNutrition,
  deleteNutritionEntry,
  getNutritionStats,
  testNutrition
} from '../controlllers/nutritionController.js';
import { requireSignIn } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Test endpoint
router.get('/test', requireSignIn, testNutrition);

// Add nutrition entry
router.post('/add', requireSignIn, addNutritionEntry);

// Get nutrition entries
router.get('/entries', requireSignIn, getNutritionEntries);

// Get today's nutrition
router.get('/today', requireSignIn, getTodayNutrition);

// Get nutrition statistics
router.get('/stats', requireSignIn, getNutritionStats);

// Delete nutrition entry
router.delete('/entry/:id', requireSignIn, deleteNutritionEntry);

export default router;