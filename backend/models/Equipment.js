import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    equipmentName: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Tractor',
        'Harvester',
        'Cultivator',
        'Plough',
        'Seeder',
        'Sprayer',
        'Rotavator',
        'Thresher',
        'Trailer',
        'Irrigation Equipment',
        'Other'
      ],
      default: 'Tractor'
    },
    brand: {
      type: String,
      default: '',
      trim: true
    },
    model: {
      type: String,
      default: '',
      trim: true
    },
    yearOfPurchase: {
      type: Number,
      default: new Date().getFullYear()
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    images: {
      type: [String],
      default: []
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: [0, 'Price per hour must be positive']
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price per day must be positive']
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit must be positive']
    },
    fuelPolicy: {
      type: String,
      enum: [
        'Included in price',
        'Renter pays actual fuel used',
        'Full to full tank policy',
        'Not applicable / Electric'
      ],
      default: 'Renter pays actual fuel used'
    },
    availableFrom: {
      type: Date,
      default: Date.now
    },
    availableTo: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    area: {
      type: String,
      default: '',
      trim: true
    },
    pinCode: {
      type: String,
      default: '',
      trim: true
    },
    specifications: {
      horsePower: { type: String, default: '' },
      fuelType: { type: String, default: 'Diesel' },
      condition: { type: String, default: 'Excellent' }
    },
    rating: {
      type: Number,
      default: 4.8
    },
    totalRentals: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster search and filtering
equipmentSchema.index({ equipmentName: 'text', description: 'text', brand: 'text', model: 'text' });
equipmentSchema.index({ category: 1, city: 1, isAvailable: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;
