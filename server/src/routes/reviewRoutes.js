import express from 'express';
import { createReview, getSkillReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/skill/:skillId', getSkillReviews);

export default router;