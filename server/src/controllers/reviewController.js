import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Skill from '../models/Skill.js';

// @desc    Create a review for a completed booking
// @route   POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }

    if (booking.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Only the learner can review this session' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ status: 'error', message: 'Can only review completed sessions' });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ status: 'error', message: 'Review already submitted for this booking' });
    }

    const review = await Review.create({
      skill: booking.skill,
      booking: bookingId,
      reviewer: req.user._id,
      provider: booking.provider,
      rating,
      comment,
    });

    // Update skill average rating
    const skill = await Skill.findById(booking.skill);
    const reviews = await Review.find({ skill: booking.skill });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    skill.rating = avgRating;
    skill.numReviews = reviews.length;
    await skill.save();

    res.status(201).json({ status: 'success', data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific skill
// @route   GET /api/reviews/skill/:skillId
export const getSkillReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ skill: req.params.skillId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', results: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};