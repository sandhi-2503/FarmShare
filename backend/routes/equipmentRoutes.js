import express from 'express';
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  getMyEquipment,
  updateEquipment,
  deleteEquipment,
  getRecommendedEquipment,
  getGlobalPlatformStats
} from '../controllers/equipmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadEquipmentImages } from '../middleware/uploadMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional auth helper for recommendations
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'farmshare_ai_secure_jwt_token_key_2026_growth'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // ignore
    }
  }
  next();
};

router.get('/stats/global', getGlobalPlatformStats);
router.get('/recommendations', optionalAuth, getRecommendedEquipment);
router.get('/my', protect, getMyEquipment);

router
  .route('/')
  .get(getAllEquipment)
  .post(protect, uploadEquipmentImages.array('images', 5), createEquipment);

router
  .route('/:id')
  .get(getEquipmentById)
  .put(protect, uploadEquipmentImages.array('images', 5), updateEquipment)
  .delete(protect, deleteEquipment);

export default router;
