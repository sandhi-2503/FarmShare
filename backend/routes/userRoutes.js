import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
