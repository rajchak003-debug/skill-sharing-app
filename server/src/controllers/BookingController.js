import Booking from '../models/Booking.js';
import Skill from '../models/Skill.js';

// @desc    Create a new booking request
// @route   POST /api/bookings
export const createBooking = async (req, res, next) => {
  try {
    const { skillId, sessionDate, durationMinutes, message } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ status: 'error', message: 'Skill not found' });
    }

    if (skill.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ status: 'error', message: 'You cannot book your own skill' });
    }

    const booking = await Booking.create({
      skill: skillId,
      learner: req.user._id,
      provider: skill.owner,
      sessionDate,
      durationMinutes: durationMinutes || 60,
      message,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('skill', 'title category')
      .populate('learner', 'name email avatar')
      .populate('provider', 'name email avatar');

    res.status(201).json({ status: 'success', data: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for logged-in user (as learner or provider)
// @route   GET /api/bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $or: [{ learner: req.user._id }, { provider: req.user._id }]
    })
      .populate('skill', 'title category images')
      .populate('learner', 'name email avatar')
      .populate('provider', 'name email avatar')
      .sort({ sessionDate: 1 });

    res.status(200).json({ status: 'success', results: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (accept, reject, completed, cancelled)
// @route   PATCH /api/bookings/:id/status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }

    const isProvider = booking.provider.toString() === req.user._id.toString();
    const isLearner = booking.learner.toString() === req.user._id.toString();

    if (!isProvider && !isLearner) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('skill', 'title category')
      .populate('learner', 'name email avatar')
      .populate('provider', 'name email avatar');

    res.status(200).json({ status: 'success', data: updatedBooking });
  } catch (error) {
    next(error);
  }
};