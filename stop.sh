#!/bin/bash

# SEO Audit Agent - Stop Script
echo "🛑 Stopping SEO Audit Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill processes on ports 3000 and 3001
echo -e "${YELLOW}🧹 Stopping services on ports 3000 and 3001...${NC}"

KILLED_PROCESSES=0

# Check and kill port 3000 (Frontend)
FRONTEND_PID=$(lsof -ti:3000)
if [ ! -z "$FRONTEND_PID" ]; then
    kill -9 $FRONTEND_PID 2>/dev/null
    echo -e "${RED}✗ Frontend (port 3000) stopped${NC}"
    KILLED_PROCESSES=$((KILLED_PROCESSES + 1))
fi

# Check and kill port 3001 (Backend)  
BACKEND_PID=$(lsof -ti:3001)
if [ ! -z "$BACKEND_PID" ]; then
    kill -9 $BACKEND_PID 2>/dev/null
    echo -e "${RED}✗ Backend (port 3001) stopped${NC}"
    KILLED_PROCESSES=$((KILLED_PROCESSES + 1))
fi

if [ $KILLED_PROCESSES -eq 0 ]; then
    echo -e "${GREEN}✅ No services were running${NC}"
else
    echo -e "${GREEN}✅ Stopped $KILLED_PROCESSES service(s)${NC}"
fi

echo -e "${GREEN}🎉 SEO Audit Agent stopped successfully${NC}" 