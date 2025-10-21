#!/bin/bash

# Gujarat Real Estate - Deployment Script
# This script helps deploy all three parts of the application

echo "🚀 Gujarat Real Estate Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All dependencies are installed."
}

# Install dependencies for all projects
install_dependencies() {
    print_status "Installing dependencies for all projects..."
    
    # Backend
    print_status "Installing backend dependencies..."
    cd backend && npm install
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed."
    else
        print_error "Failed to install backend dependencies."
        exit 1
    fi
    cd ..
    
    # Admin Dashboard
    print_status "Installing admin dashboard dependencies..."
    cd admin-dashboard && npm install
    if [ $? -eq 0 ]; then
        print_success "Admin dashboard dependencies installed."
    else
        print_error "Failed to install admin dashboard dependencies."
        exit 1
    fi
    cd ..
    
    # Frontend
    print_status "Installing frontend dependencies..."
    cd GujaratRealEstate-main && npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed."
    else
        print_error "Failed to install frontend dependencies."
        exit 1
    fi
    cd ..
}

# Build projects
build_projects() {
    print_status "Building projects..."
    
    # Admin Dashboard
    print_status "Building admin dashboard..."
    cd admin-dashboard && npm run build
    if [ $? -eq 0 ]; then
        print_success "Admin dashboard built successfully."
    else
        print_error "Failed to build admin dashboard."
        exit 1
    fi
    cd ..
    
    # Frontend
    print_status "Building frontend..."
    cd GujaratRealEstate-main && npm run build
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully."
    else
        print_error "Failed to build frontend."
        exit 1
    fi
    cd ..
}

# Deploy to platforms
deploy_projects() {
    print_status "Starting deployment process..."
    
    print_warning "Please ensure you have:"
    print_warning "1. Railway CLI installed and logged in"
    print_warning "2. Vercel CLI installed and logged in"
    print_warning "3. Environment variables configured on platforms"
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled."
        exit 0
    fi
    
    # Deploy backend to Railway
    print_status "Deploying backend to Railway..."
    cd backend
    if command -v railway &> /dev/null; then
        railway up
        if [ $? -eq 0 ]; then
            print_success "Backend deployed to Railway."
        else
            print_error "Failed to deploy backend to Railway."
        fi
    else
        print_warning "Railway CLI not found. Please deploy backend manually."
    fi
    cd ..
    
    # Deploy admin dashboard to Vercel
    print_status "Deploying admin dashboard to Vercel..."
    cd admin-dashboard
    if command -v vercel &> /dev/null; then
        vercel --prod
        if [ $? -eq 0 ]; then
            print_success "Admin dashboard deployed to Vercel."
        else
            print_error "Failed to deploy admin dashboard to Vercel."
        fi
    else
        print_warning "Vercel CLI not found. Please deploy admin dashboard manually."
    fi
    cd ..
    
    # Deploy frontend to Vercel
    print_status "Deploying frontend to Vercel..."
    cd GujaratRealEstate-main
    if command -v vercel &> /dev/null; then
        vercel --prod
        if [ $? -eq 0 ]; then
            print_success "Frontend deployed to Vercel."
        else
            print_error "Failed to deploy frontend to Vercel."
        fi
    else
        print_warning "Vercel CLI not found. Please deploy frontend manually."
    fi
    cd ..
}

# Main deployment flow
main() {
    echo
    print_status "Starting Gujarat Real Estate deployment process..."
    echo
    
    check_dependencies
    echo
    
    print_status "What would you like to do?"
    echo "1. Install dependencies only"
    echo "2. Build projects only"
    echo "3. Full deployment (install + build + deploy)"
    echo "4. Exit"
    echo
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            install_dependencies
            print_success "Dependencies installed successfully!"
            ;;
        2)
            build_projects
            print_success "Projects built successfully!"
            ;;
        3)
            install_dependencies
            echo
            build_projects
            echo
            deploy_projects
            echo
            print_success "Deployment process completed!"
            ;;
        4)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo
    print_success "All tasks completed successfully!"
    print_status "Check the deployment guide (DEPLOYMENT_GUIDE.md) for manual deployment steps."
}

# Run main function
main