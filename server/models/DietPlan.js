import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  foods: [{
    name: {
      type: String,
      required: true
    },
    calories: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      required: true
    },
    carbs: {
      type: Number,
      required: true
    },
    fats: {
      type: Number,
      required: true
    }
  }]
});

const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['weight-loss', 'muscle-gain', 'maintenance', 'keto', 'vegan', 'mediterranean'],
    required: true
  },
  dailyCalories: {
    type: Number,
    required: true
  },
  targetProtein: {
    type: Number,
    required: true
  },
  targetCarbs: {
    type: Number,
    required: true
  },
  targetFats: {
    type: Number,
    required: true
  },
  meals: [mealSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: String,
    enum: ['1-week', '2-weeks', '1-month', '3-months', 'ongoing'],
    default: 'ongoing'
  }
}, {
  timestamps: true
});

// Index for efficient queries
dietPlanSchema.index({ category: 1, isPublic: 1 });
dietPlanSchema.index({ createdBy: 1 });

export default mongoose.model('DietPlan', dietPlanSchema);