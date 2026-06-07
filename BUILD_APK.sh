#!/bin/bash

echo "🚀 Building APK for Customer Mobile App..."
echo ""

# Check if EAS is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Login to EAS
echo "🔐 Please login to your Expo account..."
eas login

# Configure EAS (if not already done)
echo "⚙️  Configuring EAS Build..."
eas build:configure

# Build APK
echo "🏗️  Building APK (this will take 10-20 minutes)..."
echo ""
echo "Choose build profile:"
echo "1) Preview (development APK - faster)"
echo "2) Production (release APK - optimized)"
read -p "Enter choice [1 or 2]: " choice

if [ "$choice" == "1" ]; then
    eas build -p android --profile preview
else
    eas build -p android --profile production
fi

echo ""
echo "✅ Build complete! Download link will be shown above."
echo "📱 Install the APK on your Android device to test."
