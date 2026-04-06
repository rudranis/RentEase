import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

dotenv.config();

const extraSeed = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        const owner1 = await User.findOne({ email: 'owner@demo.com' });
        let owner2 = await User.findOne({ email: 'shaikhrizwanofficial@gmail.com' });

        if (!owner2) {
            console.log('Creating shaikhrizwanofficial user...');
            owner2 = await User.create({
                name: 'Rizwan Shaikh',
                email: 'shaikhrizwanofficial@gmail.com',
                password: 'Password123',
                phone: '9876543210',
                role: 'owner',
                isVerified: true
            });
        }

        const listings = [
            {
                owner: owner1._id,
                title: "Professional DSLR Camera - Canon EOS R5",
                description: "High-end 45MP full-frame mirrorless camera. Perfect for professional photography and 8K video. Includes 24-70mm lens and 2 batteries.",
                category: "electronics",
                images: ["/images/camera.png"],
                pricePerDay: 4500,
                deposit: 15000,
                location: { city: "Mumbai", address: "Bandra West", state: "Maharashtra" },
                amenities: ["8K Video", "Full Frame", "Dual Card Slots", "Weather Sealed"],
                deliveryAvailable: true,
                deliveryCharge: 500
            },
            {
                owner: owner1._id,
                title: "DJI Mavic 3 Pro Drone - Cine Edition",
                description: "Triple-camera system drone with Hasselblad main camera. Supports Apple ProRes and 43-min flight time. Includes Smart Controller.",
                category: "electronics",
                images: ["/images/drone.png"],
                pricePerDay: 6000,
                deposit: 20000,
                location: { city: "Mumbai", address: "Juhu", state: "Maharashtra" },
                amenities: ["4K/120fps", "15km Range", "Omnidirectional Sensing"],
                deliveryAvailable: true,
                deliveryCharge: 1000
            },
            {
                owner: owner1._id,
                title: "Electric City Scooter - Segway Ninebot",
                description: "Compact and powerful electric scooter for city commutes. 45km range and 25km/h top speed. Lightweight and foldable.",
                category: "bike",
                images: ["/images/scooter.png"],
                pricePerDay: 800,
                deposit: 3000,
                location: { city: "Mumbai", address: "Andheri East", state: "Maharashtra" },
                amenities: ["Foldable", "App Sync", "Dual Braking"],
                deliveryAvailable: false
            },
            {
                owner: owner2._id,
                title: "Luxury Rolex Submariner Date",
                description: "Iconic luxury divers watch. Oystersteel with black dial and Cerachrom bezel. Perfect for formal events and weddings.",
                category: "other",
                images: ["/images/watch.png"],
                pricePerDay: 12000,
                deposit: 50000,
                location: { city: "Mumbai", address: "South Mumbai", state: "Maharashtra" },
                amenities: ["Waterproof", "Automatic Movement", "Sapphire Crystal"],
                deliveryAvailable: true,
                deliveryCharge: 2000
            },
            {
                owner: owner2._id,
                title: "Sony PlayStation 5 - Disc Edition",
                description: "Latest generation gaming console. Includes 2 DualSense controllers and 5 popular titles (FIFA 24, Spider-Man 2, etc.)",
                category: "electronics",
                images: ["/images/ps5.png"],
                pricePerDay: 1500,
                deposit: 5000,
                location: { city: "Mumbai", address: "Powai", state: "Maharashtra" },
                amenities: ["4K Gaming", "High Frame Rate", "SSD Speed"],
                deliveryAvailable: true,
                deliveryCharge: 300
            },
            {
                owner: owner2._id,
                title: "JBL PartyBox 710 - High Power Speaker",
                description: "800W RMS powerful sound with dynamic light show. Perfect for large parties and outdoor events. Splashproof design.",
                category: "electronics",
                images: ["/images/speaker.png"],
                pricePerDay: 2500,
                deposit: 8000,
                location: { city: "Mumbai", address: "Worli", state: "Maharashtra" },
                amenities: ["Bluetooth", "RGB Lights", "Karaoke Input"],
                deliveryAvailable: true,
                deliveryCharge: 600
            }
        ];

        await Listing.insertMany(listings);
        console.log('✓ 6 Premium listings added successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding extra data:', error);
        process.exit(1);
    }
};

extraSeed();
