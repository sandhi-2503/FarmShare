import express from 'express';
import {
  createRentalRequest,
  getMyRentalRequests,
  getOwnerRentalRequests,
  getRentalRequestById,
  approveRentalRequest,
  rejectRentalRequest,
  cancelRentalRequest,
  completeRentalRequest,
  getDashboardStats
} from '../controllers/rentalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All rental routes are protected

router.post('/', createRentalRequest);
router.get('/my-requests', getMyRentalRequests);
router.get('/owner-requests', getOwnerRentalRequests);
router.get('/dashboard-stats', getDashboardStats);

router.get('/:id', getRentalRequestById);
router.put('/:id/approve', approveRentalRequest);
router.put('/:id/reject', rejectRentalRequest);
router.put('/:id/cancel', cancelRentalRequest);
router.put('/:id/complete', completeRentalRequest);

export default router;
