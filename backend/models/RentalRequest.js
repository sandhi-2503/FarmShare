import mongoose from 'mongoose';

const rentalRequestSchema = new mongoose.Schema(
  {
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    rentalType: {
      type: String,
      enum: ['hourly', 'daily'],
      required: [true, 'Rental type must be either hourly or daily']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    startTime: {
      type: String,
      default: '09:00'
    },
    endTime: {
      type: String,
      default: '18:00'
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1']
    },
    rentalAmount: {
      type: Number,
      required: true,
      min: [0, 'Rental amount must be positive']
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit must be positive']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be positive']
    },
    message: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const RentalRequest = mongoose.model('RentalRequest', rentalRequestSchema);
export default RentalRequest;
