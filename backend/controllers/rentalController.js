import RentalRequest from '../models/RentalRequest.js';
import Equipment from '../models/Equipment.js';
import User from '../models/User.js';
import { createNotification } from '../services/notificationService.js';

// Helper: Check for overlapping approved rentals
const checkBookingOverlap = async (equipmentId, startDate, endDate, excludeRentalId = null) => {
  const query = {
    equipment: equipmentId,
    status: 'approved',
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  };

  if (excludeRentalId) {
    query._id = { $ne: excludeRentalId };
  }

  const conflictingBooking = await RentalRequest.findOne(query);
  return !!conflictingBooking;
};

// @desc    Create a new rental request
// @route   POST /api/rentals
// @access  Private (Renter/Both)
export const createRentalRequest = async (req, res, next) => {
  try {
    const {
      equipmentId,
      rentalType,
      startDate,
      endDate,
      startTime = '09:00',
      endTime = '18:00',
      message
    } = req.body;

    if (!equipmentId || !rentalType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide equipment, rental type, start date, and end date.'
      });
    }

    // Validate rentalType enum strictly
    if (!['hourly', 'daily'].includes(rentalType)) {
      return res.status(400).json({
        success: false,
        message: 'Rental type must be either "hourly" or "daily".'
      });
    }

    const equipment = await Equipment.findById(equipmentId).populate('owner');
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found.'
      });
    }

    // Prevent owner from renting their own equipment
    if (equipment.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own machinery.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date.'
      });
    }

    // Section 43: Check overlapping approved bookings
    const isOverlapping = await checkBookingOverlap(equipment._id, start, end);
    if (isOverlapping) {
      return res.status(400).json({
        success: false,
        message: 'This equipment is already booked for the selected period.'
      });
    }

    // Section 44: Accurate Server-Side Rental Calculation
    let duration = 1;
    let rentalAmount = 0;

    if (rentalType === 'daily') {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      duration = Math.max(diffDays, 1);
      rentalAmount = duration * equipment.pricePerDay;
    } else if (rentalType === 'hourly') {
      // Calculate hours from start and end time or default 8h per day
      const [startH] = startTime.split(':').map(Number);
      const [endH] = endTime.split(':').map(Number);
      let hoursPerDay = endH - startH;
      if (hoursPerDay <= 0) hoursPerDay = 8;
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      duration = Math.max(diffDays * hoursPerDay, 1);
      rentalAmount = duration * equipment.pricePerHour;
    }

    const securityDeposit = equipment.securityDeposit || 0;
    const totalAmount = rentalAmount + securityDeposit;

    const rentalRequest = await RentalRequest.create({
      renter: req.user._id,
      owner: equipment.owner._id,
      equipment: equipment._id,
      rentalType,
      startDate: start,
      endDate: end,
      startTime,
      endTime,
      duration,
      rentalAmount,
      securityDeposit,
      totalAmount,
      message: message || '',
      status: 'pending'
    });

    // Section 19: Send Notification to Owner
    await createNotification({
      recipient: equipment.owner._id,
      sender: req.user._id,
      rentalRequest: rentalRequest._id,
      title: 'New Rental Request Received',
      message: `${req.user.name} submitted a rental request for your ${equipment.equipmentName}.`,
      type: 'request_received'
    });

    const populatedRequest = await RentalRequest.findById(rentalRequest._id)
      .populate('equipment')
      .populate('owner', 'name email phone location')
      .populate('renter', 'name email phone location');

    res.status(201).json({
      success: true,
      message: 'Rental request submitted successfully!',
      rentalRequest: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get renter's rental requests
// @route   GET /api/rentals/my-requests
// @access  Private
export const getMyRentalRequests = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find({ renter: req.user._id })
      .populate('equipment')
      .populate('owner', 'name email phone location profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's received rental requests
// @route   GET /api/rentals/owner-requests
// @access  Private
export const getOwnerRentalRequests = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find({ owner: req.user._id })
      .populate('equipment')
      .populate('renter', 'name email phone location profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single rental request
// @route   GET /api/rentals/:id
// @access  Private
export const getRentalRequestById = async (req, res, next) => {
  try {
    const rental = await RentalRequest.findById(req.params.id)
      .populate('equipment')
      .populate('owner', 'name email phone location profileImage')
      .populate('renter', 'name email phone location profileImage');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found.'
      });
    }

    // Access control: User must be either the owner or the renter
    const isOwner = rental.owner._id.toString() === req.user._id.toString();
    const isRenter = rental.renter._id.toString() === req.user._id.toString();

    if (!isOwner && !isRenter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this rental request.'
      });
    }

    res.json({
      success: true,
      rental
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a rental request
// @route   PUT /api/rentals/:id/approve
// @access  Private (Owner only)
export const approveRentalRequest = async (req, res, next) => {
  try {
    const rental = await RentalRequest.findById(req.params.id)
      .populate('equipment')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found.'
      });
    }

    // Verify owner
    if (rental.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the equipment owner can approve this request.'
      });
    }

    // Check date overlap again before approving
    const isOverlapping = await checkBookingOverlap(
      rental.equipment._id,
      rental.startDate,
      rental.endDate,
      rental._id
    );

    if (isOverlapping) {
      return res.status(400).json({
        success: false,
        message: 'This equipment is already booked for an overlapping period.'
      });
    }

    rental.status = 'approved';
    await rental.save();

    // Section 19: Send Notification to Renter
    await createNotification({
      recipient: rental.renter._id,
      sender: req.user._id,
      rentalRequest: rental._id,
      title: 'Rental Request Approved! 🎉',
      message: `Your rental request for ${rental.equipment.equipmentName} has been approved by ${req.user.name}.`,
      type: 'request_approved'
    });

    res.json({
      success: true,
      message: 'Rental request approved successfully!',
      rental
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a rental request
// @route   PUT /api/rentals/:id/reject
// @access  Private (Owner only)
export const rejectRentalRequest = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const rental = await RentalRequest.findById(req.params.id)
      .populate('equipment')
      .populate('renter', 'name email');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found.'
      });
    }

    if (rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the equipment owner can reject this request.'
      });
    }

    rental.status = 'rejected';
    rental.rejectionReason = reason || 'Equipment unavailable for requested schedule.';
    await rental.save();

    // Section 19: Send Notification to Renter
    await createNotification({
      recipient: rental.renter._id,
      sender: req.user._id,
      rentalRequest: rental._id,
      title: 'Rental Request Update',
      message: `Your rental request for ${rental.equipment.equipmentName} was declined.`,
      type: 'request_rejected'
    });

    res.json({
      success: true,
      message: 'Rental request rejected.',
      rental
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a rental request
// @route   PUT /api/rentals/:id/cancel
// @access  Private (Renter only)
export const cancelRentalRequest = async (req, res, next) => {
  try {
    const rental = await RentalRequest.findById(req.params.id).populate('equipment');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found.'
      });
    }

    if (rental.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the renter can cancel this request.'
      });
    }

    if (rental.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed rental.'
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    // Notify Owner
    await createNotification({
      recipient: rental.owner,
      sender: req.user._id,
      rentalRequest: rental._id,
      title: 'Rental Request Cancelled',
      message: `${req.user.name} cancelled their rental request for ${rental.equipment.equipmentName}.`,
      type: 'request_cancelled'
    });

    res.json({
      success: true,
      message: 'Rental request cancelled.',
      rental
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a rental
// @route   PUT /api/rentals/:id/complete
// @access  Private (Owner / Renter)
export const completeRentalRequest = async (req, res, next) => {
  try {
    const rental = await RentalRequest.findById(req.params.id).populate('equipment');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found.'
      });
    }

    const isOwner = rental.owner.toString() === req.user._id.toString();
    const isRenter = rental.renter.toString() === req.user._id.toString();

    if (!isOwner && !isRenter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.'
      });
    }

    rental.status = 'completed';
    await rental.save();

    // Increment equipment total rentals count
    await Equipment.findByIdAndUpdate(rental.equipment._id, {
      $inc: { totalRentals: 1 }
    });

    // Notify other party
    const recipientId = isOwner ? rental.renter : rental.owner;
    await createNotification({
      recipient: recipientId,
      sender: req.user._id,
      rentalRequest: rental._id,
      title: 'Rental Completed Successfully! 🌾',
      message: `The rental for ${rental.equipment.equipmentName} has been marked as completed.`,
      type: 'request_completed'
    });

    res.json({
      success: true,
      message: 'Rental marked as completed.',
      rental
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get combined Dashboard Statistics for Owner & Renter
// @route   GET /api/rentals/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Owner statistics (Machinery owned by THIS user)
    const [totalMachinery, availableMachinery] = await Promise.all([
      Equipment.countDocuments({ owner: userId }),
      Equipment.countDocuments({ owner: userId, isAvailable: true })
    ]);

    const ownerRequests = await RentalRequest.find({ owner: userId });
    const pendingOwnerRequests = ownerRequests.filter((r) => r.status === 'pending').length;
    const approvedOwnerRentals = ownerRequests.filter((r) => r.status === 'approved').length;
    const completedOwnerRentals = ownerRequests.filter((r) => r.status === 'completed').length;
    
    // Calculate total earnings from approved and completed rentals
    const totalEarnings = ownerRequests
      .filter((r) => r.status === 'approved' || r.status === 'completed')
      .reduce((sum, r) => sum + (r.rentalAmount || 0), 0);

    // 2. Renter statistics (Requests made by THIS user)
    const renterRequests = await RentalRequest.find({ renter: userId });
    const totalRenterRequests = renterRequests.length;
    const pendingRenterRequests = renterRequests.filter((r) => r.status === 'pending').length;
    const approvedRenterRentals = renterRequests.filter((r) => r.status === 'approved').length;
    const rejectedRenterRentals = renterRequests.filter((r) => r.status === 'rejected').length;
    const completedRenterRentals = renterRequests.filter((r) => r.status === 'completed').length;

    const totalSpent = renterRequests
      .filter((r) => r.status === 'approved' || r.status === 'completed')
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

    res.json({
      success: true,
      ownerStats: {
        totalMachinery,
        availableMachinery,
        pendingRequests: pendingOwnerRequests,
        activeRentals: approvedOwnerRentals,
        completedRentals: completedOwnerRentals,
        totalEarnings
      },
      renterStats: {
        totalRequests: totalRenterRequests,
        pending: pendingRenterRequests,
        approved: approvedRenterRentals,
        rejected: rejectedRenterRentals,
        completed: completedRenterRentals,
        totalSpent
      }
    });
  } catch (error) {
    next(error);
  }
};
