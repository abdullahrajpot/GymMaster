import mongoose from 'mongoose';

const userDietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dietPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DietPlan',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  customizations: {
    dailyCalories: Number,
    targetProtein: Number,
    targetCarbs: Number,
    targetFats: Number
  },
  progress: [{
    date: {
      type: Date,
      required: true
    },
    adherence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
userDietPlanSchema.index({ userId: 1, isActive: 1 });
userDietPlanSchema.index({ userId: 1, startDate: -1 });

export default mongoose.model('UserDietPlan', userDietPlanSchema);