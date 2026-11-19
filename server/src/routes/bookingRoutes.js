import express from 'express';
import { createBooking, getUserBookings, updateBookingStatus } from '../controllers/BookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getUserBookings);

router.patch('/:id/status', protect, updateBookingStatus);

export default router;