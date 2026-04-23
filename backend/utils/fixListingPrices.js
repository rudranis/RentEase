import Listing from "../models/Listing.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

const fixListingPrices = async () => {
    try {
        await connectDB();

        console.log("🔧 Fixing listings with invalid prices...\n");

        // Find all listings with 0 or missing pricePerDay
        const invalidListings = await Listing.find({
            $or: [
                { pricePerDay: 0 },
                { pricePerDay: null },
                { pricePerDay: undefined },
            ],
        });

        if (invalidListings.length === 0) {
            console.log("✅ All listings have valid pricing!");
            process.exit(0);
        }

        console.log(`Found ${invalidListings.length} listing(s) with invalid pricing:\n`);

        // Update each listing with a reasonable default price based on category
        const categoryPrices = {
            apartment: 2500,
            bike: 800,
            car: 1500,
            tools: 300,
            electronics: 500,
            furniture: 600,
            books: 100,
            sports: 400,
            other: 500,
        };

        for (const listing of invalidListings) {
            const defaultPrice = categoryPrices[listing.category] || 1000;
            const defaultDeposit = Math.max(defaultPrice * 2, 5000);

            console.log(`📍 ${listing.title}`);
            console.log(`   Category: ${listing.category}`);
            console.log(`   Old Price: ₹${listing.pricePerDay || 0}`);
            console.log(`   New Price: ₹${defaultPrice}`);
            console.log(`   New Deposit: ₹${defaultDeposit}\n`);

            await Listing.findByIdAndUpdate(
                listing._id,
                {
                    pricePerDay: defaultPrice,
                    pricePerWeek: defaultPrice * 6,
                    pricePerMonth: defaultPrice * 25,
                    deposit: defaultDeposit,
                },
                { new: true }
            );
        }

        console.log("✅ All listings have been fixed!");
        console.log(`Updated ${invalidListings.length} listing(s)`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing listing prices:", error);
        process.exit(1);
    }
};

fixListingPrices();
