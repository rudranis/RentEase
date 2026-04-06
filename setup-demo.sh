#!/bin/bash
# Quick Setup Script for RentSystem Demo

echo "╔════════════════════════════════════════════════╗"
echo "║   RentSystem Demo Setup                        ║"
echo "║   Creating demo users and sample data          ║"
echo "╚════════════════════════════════════════════════╝"

# Navigate to backend
cd backend

# Run seed script
echo ""
echo "🌱 Seeding database with demo users..."
npm run seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "Your application is now ready with demo users!"
