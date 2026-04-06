import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Message from "../models/Message.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing app data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});

    console.log("Database cleared");

    const adminEmail = process.env.ROOT_ADMIN_EMAIL || "admin@rentapp.com";
    const adminPassword = process.env.ROOT_ADMIN_PASSWORD || "Admin@123";

    const adminUser = await User.create({
      name: "Root Admin",
      email: adminEmail,
      password: adminPassword,
      phone: process.env.ROOT_ADMIN_PHONE || "9999999999",
      role: "admin",
      isVerified: true,
      bio: "Root administrator with full access",
    });

    console.log("✓ Root admin created");

    // Create Demo Users
    const owner1 = await User.create({
      name: "Rajesh Kumar",
      email: "owner@demo.com",
      password: "Demo@123",
      phone: "9876543210",
      role: "owner",
      isVerified: true,
      bio: "Professional rental owner with many listings",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
      },
      ratings: { average: 4.5, count: 12 },
    });

    const user1 = await User.create({
      name: "John Doe",
      email: "user@demo.com",
      password: "Demo@123",
      phone: "9876543211",
      role: "user",
      isVerified: true,
      bio: "Looking for great rentals",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
      },
    });

    const user2 = await User.create({
      name: "Priya Singh",
      email: "priya@demo.com",
      password: "Demo@123",
      phone: "9876543212",
      role: "user",
      isVerified: true,
      bio: "Student looking for apartments",
      location: {
        city: "Bangalore",
        state: "Karnataka",
      },
    });

    const owner2 = await User.create({
      name: "Amit Patel",
      email: "amit@demo.com",
      password: "Demo@123",
      phone: "9876543213",
      role: "owner",
      isVerified: true,
      bio: "Car rental specialist",
      location: {
        city: "Delhi",
        state: "Delhi",
      },
      ratings: { average: 4.8, count: 25 },
    });

    console.log("✓ Demo users created");

    // Create Sample Listings
    const listing1 = await Listing.create({
      title: "Modern 2BHK Apartment in Bandra",
      description:
        "Fully furnished modern apartment with all amenities in prime location",
      category: "apartment",
      owner: owner1._id,
      pricePerDay: 2500,
      pricePerWeek: 15000,
      pricePerMonth: 50000,
      deposit: 10000,
      images: ["https://via.placeholder.com/400x300?text=Apartment+1"],
      location: {
        address: "Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
      },
      amenities: ["WiFi", "AC", "Parking", "Kitchen"],
      deliveryAvailable: true,
      deliveryRadius: 15,
      deliveryCharge: 500,
      isActive: true,
    });

    const listing2 = await Listing.create({
      title: "Honda City - Well Maintained",
      description:
        "Clean, well-maintained car available for rent. Fuel efficiency and comfortable ride.",
      category: "car",
      owner: owner2._id,
      pricePerDay: 1500,
      pricePerWeek: 8000,
      deposit: 5000,
      images: ["https://via.placeholder.com/400x300?text=Car+Rental"],
      location: {
        address: "Delhi Airport",
        city: "Delhi",
        state: "Delhi",
        pincode: "110037",
      },
      amenities: ["AC", "Power Steering", "Insurance Included"],
      deliveryAvailable: true,
      deliveryCharge: 300,
      isActive: true,
    });

    console.log("✓ Sample listings created");

    console.log("\n╔════════════════════════════════════════════════╗");
    console.log("║          DEMO CREDENTIALS READY                ║");
    console.log("╠════════════════════════════════════════════════╣");
    console.log("║ ADMIN USER:                                    ║");
    console.log(`║   Email: ${adminEmail.padEnd(39)}║`);
    console.log(`║   Password: Admin@2005${" ".repeat(18)}║`);
    console.log("╠════════════════════════════════════════════════╣");
    console.log("║ DEMO OWNER:                                    ║");
    console.log("║   Email: owner@demo.com                        ║");
    console.log("║   Password: Demo@123                           ║");
    console.log("╠════════════════════════════════════════════════╣");
    console.log("║ DEMO USER 1:                                   ║");
    console.log("║   Email: user@demo.com                         ║");
    console.log("║   Password: Demo@123                           ║");
    console.log("╠════════════════════════════════════════════════╣");
    console.log("║ DEMO USER 2:                                   ║");
    console.log("║   Email: priya@demo.com                        ║");
    console.log("║   Password: Demo@123                           ║");
    console.log("╠════════════════════════════════════════════════╣");
    console.log("║ DEMO OWNER 2:                                  ║");
    console.log("║   Email: amit@demo.com                         ║");
    console.log("║   Password: Demo@123                           ║");
    console.log("╚════════════════════════════════════════════════╝");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
