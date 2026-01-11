#!/bin/bash
# Setup script for emotion-ai-tutor project
# Run this script on a new laptop to set up the environment

set -e  # Exit on error

echo "=========================================="
echo "🚀 Setting up Emotion-Aware AI Tutor"
echo "=========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Create virtual environment
if [ -d "venv" ]; then
    echo "⚠️  Virtual environment already exists. Removing..."
    rm -rf venv
fi

echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "✅ Virtual environment created and activated"
echo ""

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
echo "✅ pip upgraded"
echo ""

# Install Python dependencies
if [ -f "requirements_frozen.txt" ]; then
    echo "📥 Installing Python dependencies (exact versions)..."
    pip install -r requirements_frozen.txt
    echo "✅ Python dependencies installed from requirements_frozen.txt"
else
    echo "📥 Installing Python dependencies (latest compatible versions)..."
    pip install -r requirements.txt
    echo "✅ Python dependencies installed from requirements.txt"
fi
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. Skipping npm install."
    echo "   Install Node.js from: https://nodejs.org/"
    echo "   Then run: npm install"
else
    echo "✅ Node.js found: $(node --version)"
    
    # Install Node.js dependencies
    if [ -f "package.json" ]; then
        echo "📥 Installing Node.js dependencies..."
        npm install
        echo "✅ Node.js dependencies installed"
    fi
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "To activate the virtual environment:"
echo "  source venv/bin/activate"
echo ""
echo "To test the installation:"
echo "  python -c \"import torch; import numpy; print('✅ Packages work')\""
echo ""

