#!/bin/bash

# Order Wizard Development Setup Script
# Run this to prepare everything for testing

echo "🚀 Order Wizard - Development Setup"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Seed test data
echo "🌱 Seeding test data..."
cd backend || exit 1
node seed_orders_test.js

if [ $? -eq 0 ]; then
    echo "✅ Test data seeded successfully"
else
    echo "❌ Failed to seed test data"
    exit 1
fi

cd ..

echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   $ cd backend && npm start"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   $ cd frontend && npm run dev"
echo ""
echo "3. Open Browser:"
echo "   http://localhost:5173/checkout/1000"
echo ""
echo "4. Login Credentials:"
echo "   👤 Buyer: john@gmail.com / password123"
echo "   🏪 Seller: seller1@store.com / password123"
echo ""
echo "5. Test Scenarios:"
echo "   • Order #1000: Buyer checkout wizard"
echo "   • Order #1002: Seller upload shipping"
echo "   • Order #1003: Buyer see tracking"
echo ""
echo "📖 Documentation:"
echo "   • ORDER_WIZARD_GUIDE.md - Full implementation guide"
echo "   • ORDER_WIZARD_TEST.md - Detailed test procedures"
echo "   • ORDER_WIZARD_SUMMARY.txt - Visual overview"
echo "   • order_wizard_test.http - API test cases"
echo ""
echo "✨ Setup complete!"
