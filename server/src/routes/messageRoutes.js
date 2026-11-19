import express from 'express';
import { getBookingMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:bookingId')
  .get(protect, getBookingMessages)
  .post(protect, sendMessage);

export default router;