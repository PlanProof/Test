#!/bin/bash

# ComplianceAI Deployment Script
echo "🚀 Starting ComplianceAI deployment..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first:"
    echo "   curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if we're logged in to Fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Please run: flyctl auth login"
    exit 1
fi

# Build and deploy
echo "📦 Building and deploying to Fly.io..."
flyctl deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://complianceai-platform.fly.dev"
