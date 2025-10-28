#!/bin/bash

# Wolf of D Street - Installation Script

echo "🐺 Welcome to Wolf of D Street Setup!"
echo ""
echo "This script will help you set up the project."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    echo "Please update Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create a Firebase project at https://console.firebase.google.com"
echo "2. Enable Firestore Database"
echo "3. Update src/firebase.js with your Firebase config"
echo "4. Set up Firestore security rules (see SETUP.md)"
echo "5. Change admin password in src/pages/AdminLogin.jsx"
echo "6. Run 'npm run dev' to start the application"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""


