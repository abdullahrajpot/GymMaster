import mongoose from 'mongoose';

const workoutEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  exercise: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

// Index for efficient queries
workoutEntrySchema.index({ userId: 1, date: -1 });
workoutEntrySchema.index({ userId: 1, exercise: 1, date: -1 });

export default mongoose.model('WorkoutEntry', workoutEntrySchema);