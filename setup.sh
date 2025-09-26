#!/bin/bash

echo "🎵 Setting up Bhajan Sarovar Web Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Trying with legacy peer deps..."
    npm install --legacy-peer-deps
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed with legacy peer deps!"
    else
        echo "❌ Failed to install dependencies. Please check the error messages above."
        exit 1
    fi
fi

echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Environment file not found. Creating from template..."
    cp env.example .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "🔧 Please edit .env.local and add your Firebase and AWS credentials:"
    echo "   - Firebase API keys"
    echo "   - AWS S3 configuration (optional)"
    echo ""
else
    echo "✅ Environment file found"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Edit .env.local with your credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
