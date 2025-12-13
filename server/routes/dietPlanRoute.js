import express from 'express';
import {
  getDietPlans,
  getDietPlanById,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan,
  subscribeToDietPlan,
  getUserActiveDietPlan,
  getUserDietPlanHistory,
  updateDietPlanProgress,
  getDietPlanCategories
} from '../controlllers/dietPlanController.js';
import { requireSignIn, isAdmin } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/plans', getDietPlans);
router.get('/plan/:id', getDietPlanById);
router.get('/categories', getDietPlanCategories);

// User routes (require authentication)
router.post('/subscribe/:planId', requireSignIn, subscribeToDietPlan);
router.get('/user/active', requireSignIn, getUserActiveDietPlan);
router.get('/user/history', requireSignIn, getUserDietPlanHistory);
router.put('/user/progress/:planId', requireSignIn, updateDietPlanProgress);

// Admin routes
router.post('/create', requireSignIn, isAdmin, createDietPlan);
router.put('/update/:id', requireSignIn, isAdmin, updateDietPlan);
router.delete('/delete/:id', requireSignIn, isAdmin, deleteDietPlan);

export default router;