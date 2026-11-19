
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionDate: {
      type: Date,
      required: [true, 'Please provide a session date'],
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;