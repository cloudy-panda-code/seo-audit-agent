#!/bin/bash

# SEO Audit Agent - Startup Script
echo "🚀 Starting SEO Audit Agent..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js >= 18.0.0${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: v${NODE_VERSION}${NC}"
echo -e "${GREEN}✅ npm version: $(npm -v)${NC}"

# Kill any existing processes on our ports
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || echo "No processes running on ports 3000,3001"

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "shared/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm run install:all
fi

# Check if shared package is built
if [ ! -d "shared/dist" ]; then
    echo -e "${YELLOW}🔨 Building shared package...${NC}"
    npm run build:shared
fi

# Start the application
echo -e "${GREEN}🎉 Starting both frontend and backend...${NC}"
echo -e "${BLUE}Frontend will be available at: http://localhost:3000${NC}"
echo -e "${BLUE}Backend will be available at: http://localhost:3001${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"
echo ""

npm run dev 