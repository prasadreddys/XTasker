#!/bin/bash

# XTasker Setup Script
# This script automates the setup process for both backend and frontend

set -e

echo "🚀 XTasker Setup Script"
echo "======================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL not found${NC}"
    echo "Install PostgreSQL 12+ and try again"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL installed${NC}"

echo ""
echo "Setting up Backend..."
echo "===================="

# Backend setup
cd backend

if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env already exists${NC}"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
    fi
else
    echo "Creating .env from template..."
    cp .env.example .env
fi

echo "Installing backend dependencies..."
npm install

echo "Generating Prisma client..."
npm run prisma:generate

echo ""
echo -e "${YELLOW}⚠️  Database Configuration${NC}"
echo "============================="
echo "You need to configure your PostgreSQL connection."
echo ""
read -p "PostgreSQL host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}
read -p "PostgreSQL port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "PostgreSQL database name (default: xtasker): " DB_NAME
DB_NAME=${DB_NAME:-xtasker}
read -p "PostgreSQL user (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}
read -sp "PostgreSQL password: " DB_PASSWORD
echo ""

# Update .env with database configuration
DB_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" .env

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env

echo -e "${GREEN}✓ Database configuration updated${NC}"
echo ""

# Create database if it doesn't exist
echo "Creating database..."
if psql -h "$DB_HOST" -U "$DB_USER" -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
    echo -e "${YELLOW}Database already exists${NC}"
else
    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✓ Database created${NC}"
fi

echo "Running migrations..."
npm run prisma:push

echo -e "${GREEN}✓ Backend setup complete${NC}"

echo ""
echo "Setting up Frontend..."
echo "===================="

cd ../frontend

if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.local.example .env.local
    fi
else
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
fi

echo "Installing frontend dependencies..."
npm install

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
sed -i.bak "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$NEXTAUTH_SECRET|" .env.local

echo -e "${GREEN}✓ Frontend setup complete${NC}"

echo ""
echo "Setup Complete! 🎉"
echo "=================="
echo ""
echo "To start developing:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "  Prisma Studio: npm run prisma:studio (from backend dir)"
echo ""
echo "Test credentials:"
echo "  Email: test@example.com"
echo "  Password: TestPassword123!"
echo ""
