import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Equipment from '../models/Equipment.js';
import RentalRequest from '../models/RentalRequest.js';
import Notification from '../models/Notification.js';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Equipment.deleteMany(),
      RentalRequest.deleteMany(),
      Notification.deleteMany()
    ]);

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('farmshare123', salt);

    const users = await User.create([
      {
        name: 'Ramesh Patel',
        email: 'ramesh.patel@farmshare.in',
        phone: '+91 98765 43210',
        password: 'farmshare123', // Will be pre-hashed or hashed by Mongoose pre-save
        role: 'owner',
        bio: 'Progressive organic farmer with 15 acres in Punjab. Maintaining modern John Deere & Mahindra machinery.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        location: {
          state: 'Punjab',
          city: 'Ludhiana',
          area: 'Samrala Road',
          pinCode: '141001'
        }
      },
      {
        name: 'Suresh Kumar',
        email: 'suresh.kumar@farmshare.in',
        phone: '+91 98450 12345',
        password: 'farmshare123',
        role: 'renter',
        bio: 'Cotton and paddy grower looking for seasonal harvesting equipment and high-yield rotavators.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        location: {
          state: 'Tamil Nadu',
          city: 'Coimbatore',
          area: 'Pollachi',
          pinCode: '642001'
        }
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya.sharma@farmshare.in',
        phone: '+91 97110 56789',
        password: 'farmshare123',
        role: 'both',
        bio: 'Agripreneur managing farm services and leasing modern sprayers & seeders across Maharashtra.',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        location: {
          state: 'Maharashtra',
          city: 'Nashik',
          area: 'Panchavati',
          pinCode: '422003'
        }
      }
    ]);

    const owner1 = users[0];
    const renter1 = users[1];
    const owner2 = users[2];

    console.log('[Seed] Creating demo equipment items...');
    const equipmentList = await Equipment.create([
      {
        owner: owner1._id,
        equipmentName: 'John Deere 5050D 50 HP Tractor',
        category: 'Tractor',
        brand: 'John Deere',
        model: '5050D PowerPro',
        yearOfPurchase: 2022,
        description: 'Heavy duty 50 HP 4WD tractor equipped with dual clutch, power steering, and optimal fuel economy for deep tilling, ploughing, and heavy haulage.',
        images: [
          'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1000&q=80'
        ],
        pricePerHour: 450,
        pricePerDay: 3200,
        securityDeposit: 5000,
        fuelPolicy: 'Full to full tank policy',
        isAvailable: true,
        state: 'Punjab',
        city: 'Ludhiana',
        area: 'Samrala Road',
        pinCode: '141001',
        specifications: {
          horsePower: '50 HP',
          fuelType: 'Diesel',
          condition: 'Excellent'
        },
        rating: 4.9,
        totalRentals: 14
      },
      {
        owner: owner1._id,
        equipmentName: 'Kubota DC-68G Multi-Crop Combine Harvester',
        category: 'Harvester',
        brand: 'Kubota',
        model: 'DC-68G Paddy Master',
        yearOfPurchase: 2023,
        description: 'State-of-the-art tracked combine harvester ideal for wet paddy and wheat fields with minimal grain loss and high operational speed.',
        images: [
          'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80'
        ],
        pricePerHour: 1800,
        pricePerDay: 12500,
        securityDeposit: 15000,
        fuelPolicy: 'Renter pays actual fuel used',
        isAvailable: true,
        state: 'Punjab',
        city: 'Ludhiana',
        area: 'Gill Road',
        pinCode: '141006',
        specifications: {
          horsePower: '68 HP',
          fuelType: 'Diesel',
          condition: 'Like New'
        },
        rating: 5.0,
        totalRentals: 9
      },
      {
        owner: owner2._id,
        equipmentName: 'Mahindra Arjun Novo 605 DI-i 4WD',
        category: 'Tractor',
        brand: 'Mahindra',
        model: 'Arjun Novo 605 DI-i',
        yearOfPurchase: 2023,
        description: 'Powerful 57 HP tractor featuring Synchromesh transmission, high precision hydraulics, and air-conditioned cabin for long working hours.',
        images: [
          'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80'
        ],
        pricePerHour: 550,
        pricePerDay: 3800,
        securityDeposit: 6000,
        fuelPolicy: 'Included in price',
        isAvailable: true,
        state: 'Maharashtra',
        city: 'Nashik',
        area: 'Panchavati',
        pinCode: '422003',
        specifications: {
          horsePower: '57 HP',
          fuelType: 'Diesel',
          condition: 'Excellent'
        },
        rating: 4.8,
        totalRentals: 21
      },
      {
        owner: owner2._id,
        equipmentName: 'Shaktiman Semi-Champion Rotavator 7 Feet',
        category: 'Rotavator',
        brand: 'Shaktiman',
        model: 'Semi Champion 7ft',
        yearOfPurchase: 2022,
        description: 'Multi-speed gearbox rotary tiller suitable for soil preparation, clod crushing, and stubble incorporation in wet and dry conditions.',
        images: [
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80'
        ],
        pricePerHour: 300,
        pricePerDay: 1800,
        securityDeposit: 3000,
        fuelPolicy: 'Not applicable / Electric',
        isAvailable: true,
        state: 'Maharashtra',
        city: 'Nashik',
        area: 'Satpur',
        pinCode: '422007',
        specifications: {
          horsePower: 'PTO 45+ HP',
          fuelType: 'Tractor Driven',
          condition: 'Very Good'
        },
        rating: 4.7,
        totalRentals: 8
      },
      {
        owner: owner1._id,
        equipmentName: 'Aspee HTP Tractor-Mounted Boom Sprayer 500L',
        category: 'Sprayer',
        brand: 'Aspee',
        model: 'Boom 500L Turbo',
        yearOfPurchase: 2023,
        description: 'High pressure 500-liter capacity boom sprayer covering wide spans with uniform droplet distribution. Perfect for pest protection and liquid fertilizers.',
        images: [
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1000&q=80'
        ],
        pricePerHour: 250,
        pricePerDay: 1500,
        securityDeposit: 2500,
        fuelPolicy: 'Renter pays actual fuel used',
        isAvailable: true,
        state: 'Punjab',
        city: 'Ludhiana',
        area: 'Model Town',
        pinCode: '141002',
        specifications: {
          horsePower: 'PTO driven',
          fuelType: 'Tractor Driven',
          condition: 'Excellent'
        },
        rating: 4.9,
        totalRentals: 12
      },
      {
        owner: owner2._id,
        equipmentName: 'National 9-Row Automatic Seed Cum Fertilizer Drill',
        category: 'Seeder',
        brand: 'National',
        model: 'AutoDrill 9R',
        yearOfPurchase: 2021,
        description: 'Zero till seed cum fertilizer drill capable of direct drilling wheat, soy, and maize into paddy residue with minimal land prep.',
        images: [
          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80'
        ],
        pricePerHour: 220,
        pricePerDay: 1400,
        securityDeposit: 2000,
        fuelPolicy: 'Not applicable / Electric',
        isAvailable: true,
        state: 'Maharashtra',
        city: 'Pune',
        area: 'Baramati',
        pinCode: '413102',
        specifications: {
          horsePower: '35+ HP compatible',
          fuelType: 'Mechanical',
          condition: 'Good'
        },
        rating: 4.6,
        totalRentals: 6
      }
    ]);

    console.log('[Seed] Creating demo rental requests and notifications...');
    const rental1 = await RentalRequest.create({
      renter: renter1._id,
      owner: owner1._id,
      equipment: equipmentList[0]._id,
      rentalType: 'daily',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      duration: 3,
      rentalAmount: 9600,
      securityDeposit: 5000,
      totalAmount: 14600,
      message: 'Need the John Deere tractor for land leveling and field preparation.',
      status: 'approved'
    });

    const rental2 = await RentalRequest.create({
      renter: renter1._id,
      owner: owner2._id,
      equipment: equipmentList[2]._id,
      rentalType: 'daily',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      duration: 3,
      rentalAmount: 11400,
      securityDeposit: 6000,
      totalAmount: 17400,
      message: 'Looking forward to renting your Mahindra Arjun Novo for 3 days of sowing.',
      status: 'pending'
    });

    await Notification.create([
      {
        recipient: owner1._id,
        sender: renter1._id,
        rentalRequest: rental1._id,
        title: 'Rental Request Approved',
        message: 'You approved Suresh Kumar\'s booking for John Deere 5050D.',
        type: 'request_approved',
        isRead: true
      },
      {
        recipient: owner2._id,
        sender: renter1._id,
        rentalRequest: rental2._id,
        title: 'New Rental Request Received',
        message: 'Suresh Kumar submitted a rental request for Mahindra Arjun Novo 605 DI-i 4WD.',
        type: 'request_received',
        isRead: false
      }
    ]);

    console.log('✅ [Seed] Database seeded successfully with test users, machinery, and sample rentals!');
    console.log('Demo Accounts:');
    console.log('1. Owner:  ramesh.patel@farmshare.in / farmshare123');
    console.log('2. Renter: suresh.kumar@farmshare.in / farmshare123');
    console.log('3. Dual:   ananya.sharma@farmshare.in / farmshare123');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
