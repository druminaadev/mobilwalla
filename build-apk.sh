#!/bin/bash

# SalonBooking Customer App - APK Build Script
# This script builds an APK file for Android

echo "=========================================="
echo "  SalonBooking Customer App - APK Builder"
echo "=========================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "⚠️  EAS CLI not found. Installing..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI is installed"
fi

echo ""
echo "Choose build type:"
echo "1) Preview Build (APK for testing - no login required)"
echo "2) Production Build (APK for release)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting Preview Build..."
        echo "This will create an APK for testing purposes"
        echo ""
        eas build --platform android --profile preview --local
        ;;
    2)
        echo ""
        echo "🚀 Starting Production Build..."
        echo "This will create a production-ready APK"
        echo ""
        eas build --platform android --profile production
        ;;
    *)
        echo "❌ Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  Build process completed!"
echo "=========================================="
