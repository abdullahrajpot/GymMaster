import DietPlan from '../models/DietPlan.js';
import UserDietPlan from '../models/UserDietPlan.js';

// Get all public diet plans with filtering
export const getDietPlans = async (req, res) => {
  try {
    const { category, difficulty, search, limit = 20, page = 1 } = req.query;
    
    let query = { isPublic: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const plans = await DietPlan.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DietPlan.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        plans,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: plans.length,
          totalPlans: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diet plans',
      error: error.message
    });
  }
};

// Get diet plan by ID
export const getDietPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await DietPlan.findById(id)
      .populate('createdBy', 'name');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diet plan',
      error: error.message
    });
  }
};

// Create new diet plan (admin only)
export const createDietPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      dailyCalories,
      targetProtein,
      targetCarbs,
      targetFats,
      meals,
      difficulty,
      duration,
      isPublic
    } = req.body;

    const dietPlan = new DietPlan({
      name,
      description,
      category,
      dailyCalories,
      targetProtein,
      targetCarbs,
      targetFats,
      meals,
      difficulty: difficulty || 'beginner',
      duration: duration || 'ongoing',
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user._id
    });

    await dietPlan.save();

    res.status(201).json({
      success: true,
      message: 'Diet plan created successfully',
      data: dietPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating diet plan',
      error: error.message
    });
  }
};

// Update diet plan (admin only)
export const updateDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const plan = await DietPlan.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Diet plan updated successfully',
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating diet plan',
      error: error.message
    });
  }
};

// Delete diet plan (admin only)
export const deleteDietPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await DietPlan.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Also remove from user diet plans
    await UserDietPlan.deleteMany({ dietPlanId: id });

    res.status(200).json({
      success: true,
      message: 'Diet plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting diet plan',
      error: error.message
    });
  }
};

// Subscribe to diet plan
export const subscribeToDietPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { customizations, startDate } = req.body;
    const userId = req.user._id;

    // Check if plan exists
    const plan = await DietPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Deactivate current active plan
    await UserDietPlan.updateMany(
      { userId, isActive: true },
      { isActive: false, endDate: new Date() }
    );

    // Create new subscription
    const userDietPlan = new UserDietPlan({
      userId,
      dietPlanId: planId,
      startDate: startDate ? new Date(startDate) : new Date(),
      customizations: customizations || {},
      isActive: true
    });

    await userDietPlan.save();

    const populatedPlan = await UserDietPlan.findById(userDietPlan._id)
      .populate('dietPlanId')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to diet plan',
      data: populatedPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error subscribing to diet plan',
      error: error.message
    });
  }
};

// Get user's active diet plan
export const getUserActiveDietPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const userPlan = await UserDietPlan.findOne({
      userId,
      isActive: true
    })
    .populate('dietPlanId')
    .populate('userId', 'name email');

    if (!userPlan) {
      return res.status(404).json({
        success: false,
        message: 'No active diet plan found'
      });
    }

    res.status(200).json({
      success: true,
      data: userPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active diet plan',
      error: error.message
    });
  }
};

// Get user's diet plan history
export const getUserDietPlanHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    const history = await UserDietPlan.find({ userId })
      .populate('dietPlanId', 'name description category')
      .sort({ startDate: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diet plan history',
      error: error.message
    });
  }
};

// Update diet plan progress
export const updateDietPlanProgress = async (req, res) => {
  try {
    const { planId } = req.params;
    const { adherence, notes } = req.body;
    const userId = req.user._id;

    const userPlan = await UserDietPlan.findOne({
      _id: planId,
      userId,
      isActive: true
    });

    if (!userPlan) {
      return res.status(404).json({
        success: false,
        message: 'Active diet plan not found'
      });
    }

    userPlan.progress.push({
      date: new Date(),
      adherence: adherence || 0,
      notes: notes || ''
    });

    await userPlan.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: userPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// Get diet plan categories
export const getDietPlanCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'weight-loss', label: 'Weight Loss', description: 'Plans focused on calorie deficit and fat loss' },
      { value: 'muscle-gain', label: 'Muscle Gain', description: 'High protein plans for building muscle mass' },
      { value: 'maintenance', label: 'Maintenance', description: 'Balanced plans for maintaining current weight' },
      { value: 'keto', label: 'Ketogenic', description: 'Low carb, high fat diet plans' },
      { value: 'vegan', label: 'Vegan', description: 'Plant-based diet plans' },
      { value: 'mediterranean', label: 'Mediterranean', description: 'Mediterranean-style eating plans' }
    ];

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};