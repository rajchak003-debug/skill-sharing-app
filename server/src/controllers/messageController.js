import Message from '../models/Message.js';
import Booking from '../models/Booking.js';

// @desc    Get chat history for a booking
// @route   GET /api/messages/:bookingId
export const getBookingMessages = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }

    const isParticipant =
      booking.learner.toString() === req.user._id.toString() ||
      booking.provider.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to view these messages' });
    }

    const messages = await Message.find({ booking: req.params.bookingId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a new chat message
// @route   POST /api/messages/:bookingId
export const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }

    const isParticipant =
      booking.learner.toString() === req.user._id.toString() ||
      booking.provider.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to message in this booking' });
    }

    const message = await Message.create({
      booking: req.params.bookingId,
      sender: req.user._id,
      text,
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json({ status: 'success', data: populatedMessage });
  } catch (error) {
    next(error);
  }
};