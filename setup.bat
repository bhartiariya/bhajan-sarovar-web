@echo off
echo 🎵 Setting up Bhajan Sarovar Web Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies. Trying with legacy peer deps...
    npm install --legacy-peer-deps
    
    if %errorlevel% equ 0 (
        echo ✅ Dependencies installed with legacy peer deps!
    ) else (
        echo ❌ Failed to install dependencies. Please check the error messages above.
        pause
        exit /b 1
    )
)

echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  Environment file not found. Creating from template...
    copy env.example .env.local
    echo ✅ Created .env.local from template
    echo.
    echo 🔧 Please edit .env.local and add your Firebase and AWS credentials:
    echo    - Firebase API keys
    echo    - AWS S3 configuration (optional)
    echo.
) else (
    echo ✅ Environment file found
)

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Edit .env.local with your credentials
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo 📚 For more information, see README.md
pause
