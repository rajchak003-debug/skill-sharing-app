import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;