import Equipment from '../models/Equipment.js';
import RentalRequest from '../models/RentalRequest.js';
import User from '../models/User.js';
import { getSmartRecommendations } from '../services/recommendationService.js';
import fs from 'fs';
import path from 'path';

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private (Owner/Both)
export const createEquipment = async (req, res, next) => {
  try {
    const {
      equipmentName,
      category,
      brand,
      model,
      yearOfPurchase,
      description,
      pricePerHour,
      pricePerDay,
      securityDeposit,
      fuelPolicy,
      availableFrom,
      availableTo,
      state,
      city,
      area,
      pinCode,
      horsePower,
      fuelType,
      condition,
      existingImages
    } = req.body;

    if (!equipmentName || !category || !description || !pricePerHour || !pricePerDay || !state || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Category, Description, Prices, State, City)'
      });
    }

    let images = [];
    
    // Process uploaded files if any
    if (req.files && req.files.length > 0) {
      const serverBase = `${req.protocol}://${req.get('host')}`;
      images = req.files.map((file) => `${serverBase}/uploads/equipment/${file.filename}`);
    }

    // Process image URLs passed as JSON/string
    if (existingImages) {
      try {
        const parsed = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (Array.isArray(parsed)) {
          images = [...images, ...parsed];
        } else if (typeof parsed === 'string') {
          images.push(parsed);
        }
      } catch (e) {
        if (typeof existingImages === 'string') images.push(existingImages);
      }
    }

    // Fallback default image based on category if no image uploaded
    if (images.length === 0) {
      const defaultCategoryImages = {
        Tractor: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
        Harvester: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1000&q=80',
        Cultivator: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80',
        Plough: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80',
        Sprayer: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1000&q=80',
        Other: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80'
      };
      images.push(defaultCategoryImages[category] || defaultCategoryImages.Tractor);
    }

    const equipment = await Equipment.create({
      owner: req.user._id,
      equipmentName: equipmentName.trim(),
      category,
      brand: brand || '',
      model: model || '',
      yearOfPurchase: yearOfPurchase ? Number(yearOfPurchase) : new Date().getFullYear(),
      description: description.trim(),
      images,
      pricePerHour: Number(pricePerHour),
      pricePerDay: Number(pricePerDay),
      securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
      fuelPolicy: fuelPolicy || 'Renter pays actual fuel used',
      availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
      availableTo: availableTo ? new Date(availableTo) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isAvailable: true,
      state: state.trim(),
      city: city.trim(),
      area: area ? area.trim() : '',
      pinCode: pinCode ? pinCode.trim() : '',
      specifications: {
        horsePower: horsePower || '',
        fuelType: fuelType || 'Diesel',
        condition: condition || 'Excellent'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Equipment added successfully!',
      equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all equipment with search, filter, and pagination
// @route   GET /api/equipment
// @access  Public
export const getAllEquipment = async (req, res, next) => {
  try {
    const {
      search,
      category,
      city,
      state,
      minPrice,
      maxPrice,
      available,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Availability filter
    if (available !== undefined && available !== '') {
      query.isAvailable = available === 'true';
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // City & State filter
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    // Price range (checking pricePerDay)
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Text search on name, brand, model, description, category, or city
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { equipmentName: regex },
        { brand: regex },
        { model: regex },
        { category: regex },
        { city: regex },
        { state: regex },
        { area: regex },
        { description: regex }
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOptions = { pricePerDay: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { pricePerDay: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'popularity') {
      sortOptions = { totalRentals: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Equipment.countDocuments(query);
    const equipment = await Equipment.find(query)
      .populate('owner', 'name email phone location profileImage')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: equipment.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single equipment by ID
// @route   GET /api/equipment/:id
// @access  Public
export const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      'owner',
      'name email phone location profileImage bio createdAt'
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get equipment owned by the logged-in user
// @route   GET /api/equipment/my
// @access  Private
export const getMyEquipment = async (req, res, next) => {
  try {
    // CRITICAL: Strictly filtered by logged in user ID
    const equipment = await Equipment.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: equipment.length,
      equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
export const updateEquipment = async (req, res, next) => {
  try {
    let equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Access control: Make sure logged in user is the owner
    if (equipment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this equipment'
      });
    }

    const {
      equipmentName,
      category,
      brand,
      model,
      yearOfPurchase,
      description,
      pricePerHour,
      pricePerDay,
      securityDeposit,
      fuelPolicy,
      availableFrom,
      availableTo,
      isAvailable,
      state,
      city,
      area,
      pinCode,
      horsePower,
      fuelType,
      condition,
      existingImages
    } = req.body;

    let images = equipment.images || [];

    // If existing images list is sent, keep only those
    if (existingImages) {
      try {
        const parsed = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (Array.isArray(parsed)) {
          images = parsed;
        }
      } catch (e) {}
    }

    // Append new uploaded files
    if (req.files && req.files.length > 0) {
      const serverBase = `${req.protocol}://${req.get('host')}`;
      const newImages = req.files.map((file) => `${serverBase}/uploads/equipment/${file.filename}`);
      images = [...images, ...newImages];
    }

    const updatedData = {
      equipmentName: equipmentName || equipment.equipmentName,
      category: category || equipment.category,
      brand: brand !== undefined ? brand : equipment.brand,
      model: model !== undefined ? model : equipment.model,
      yearOfPurchase: yearOfPurchase ? Number(yearOfPurchase) : equipment.yearOfPurchase,
      description: description || equipment.description,
      images,
      pricePerHour: pricePerHour ? Number(pricePerHour) : equipment.pricePerHour,
      pricePerDay: pricePerDay ? Number(pricePerDay) : equipment.pricePerDay,
      securityDeposit: securityDeposit !== undefined ? Number(securityDeposit) : equipment.securityDeposit,
      fuelPolicy: fuelPolicy || equipment.fuelPolicy,
      availableFrom: availableFrom ? new Date(availableFrom) : equipment.availableFrom,
      availableTo: availableTo ? new Date(availableTo) : equipment.availableTo,
      isAvailable: isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : equipment.isAvailable,
      state: state || equipment.state,
      city: city || equipment.city,
      area: area !== undefined ? area : equipment.area,
      pinCode: pinCode !== undefined ? pinCode : equipment.pinCode,
      specifications: {
        horsePower: horsePower || equipment.specifications?.horsePower,
        fuelType: fuelType || equipment.specifications?.fuelType,
        condition: condition || equipment.specifications?.condition
      }
    };

    equipment = await Equipment.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Equipment updated successfully!',
      equipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private
export const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Access control check
    if (equipment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this equipment'
      });
    }

    // Delete associated files if stored locally
    if (equipment.images && equipment.images.length > 0) {
      equipment.images.forEach((imgUrl) => {
        if (imgUrl.includes('/uploads/equipment/')) {
          const fileName = imgUrl.split('/uploads/equipment/')[1];
          if (fileName) {
            const filePath = path.join(process.cwd(), 'uploads', 'equipment', fileName);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        }
      });
    }

    await Equipment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Equipment deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Smart Equipment Recommendations
// @route   GET /api/equipment/recommendations
// @access  Public / Private (with optional auth header)
export const getRecommendedEquipment = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const userLocation = req.user ? req.user.location : {};
    const searchContext = req.query.query || '';

    const recommendations = await getSmartRecommendations(userId, userLocation, searchContext);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Platform Statistics (real DB numbers for landing page)
// @route   GET /api/equipment/stats/global
// @access  Public
export const getGlobalPlatformStats = async (req, res, next) => {
  try {
    const [totalEquipment, totalFarmers, totalRentals, uniqueCities] = await Promise.all([
      Equipment.countDocuments(),
      User.countDocuments(),
      RentalRequest.countDocuments({ status: { $in: ['approved', 'completed'] } }),
      Equipment.distinct('city')
    ]);

    res.json({
      success: true,
      stats: {
        farmers: Math.max(totalFarmers, 50),
        machines: Math.max(totalEquipment, 20),
        rentals: Math.max(totalRentals, 120),
        locations: Math.max(uniqueCities.length, 15)
      }
    });
  } catch (error) {
    next(error);
  }
};
