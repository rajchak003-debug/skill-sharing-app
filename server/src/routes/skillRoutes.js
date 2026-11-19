
import express from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getMySkills,
} from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, upload.array('images', 3), createSkill);

router.get('/my-skills', protect, getMySkills);

router.route('/:id')
  .get(getSkillById)
  .put(protect, upload.array('images', 3), updateSkill)
  .delete(protect, deleteSkill);

export default router;