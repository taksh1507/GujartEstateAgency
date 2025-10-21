#!/bin/bash

# Gujarat Real Estate - GitHub Push Script
# This script will push your complete project to GitHub

echo "🚀 Gujarat Real Estate - GitHub Push Script"
echo "==========================================="

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

# Check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    print_success "Git is installed."
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    if [ ! -d "backend" ] || [ ! -d "admin-dashboard" ] || [ ! -d "GujaratRealEstate-main" ]; then
        print_error "Required project directories not found. Please ensure you're in the correct project directory."
        exit 1
    fi
    
    print_success "Project structure verified."
}

# Initialize git repository
init_git() {
    print_status "Initializing Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        print_success "Git repository initialized."
    else
        print_warning "Git repository already exists."
    fi
}

# Add remote repository
add_remote() {
    print_status "Adding remote repository..."
    
    # Remove existing origin if it exists
    git remote remove origin 2>/dev/null || true
    
    # Add the new remote
    git remote add origin https://github.com/taksh1507/GujartEstateAgency.git
    
    if [ $? -eq 0 ]; then
        print_success "Remote repository added successfully."
    else
        print_error "Failed to add remote repository."
        exit 1
    fi
}

# Configure git user (optional)
configure_git() {
    print_status "Checking Git configuration..."
    
    # Check if user name and email are configured
    if ! git config user.name &> /dev/null; then
        print_warning "Git user name not configured."
        read -p "Enter your name: " user_name
        git config --global user.name "$user_name"
    fi
    
    if ! git config user.email &> /dev/null; then
        print_warning "Git user email not configured."
        read -p "Enter your email: " user_email
        git config --global user.email "$user_email"
    fi
    
    print_success "Git configuration verified."
}

# Stage all files
stage_files() {
    print_status "Staging all files..."
    
    # Add all files
    git add .
    
    if [ $? -eq 0 ]; then
        print_success "All files staged successfully."
        
        # Show status
        print_status "Git status:"
        git status --short
    else
        print_error "Failed to stage files."
        exit 1
    fi
}

# Create commit
create_commit() {
    print_status "Creating initial commit..."
    
    commit_message="🎉 Initial commit: Complete Gujarat Real Estate platform

✨ Features:
- Frontend website with property listings and user authentication
- Admin dashboard with comprehensive management tools
- Backend API with Firebase and Cloudinary integration
- Real-time analytics and reporting
- Property inquiry system with conversation threads
- User management with email verification
- Complete deployment configuration for production

🏗️ Architecture:
- Frontend: React + Vite + Tailwind CSS
- Admin Dashboard: React + Vite + Tailwind CSS  
- Backend: Node.js + Express + Firebase Firestore
- Image Storage: Cloudinary CDN
- Email Service: Gmail SMTP
- Authentication: JWT with role-based access

📦 Deployment Ready:
- Railway configuration for backend deployment
- Vercel configuration for frontend deployments
- Environment variable examples
- Automated deployment scripts
- Comprehensive deployment guides

🔒 Security Features:
- JWT authentication with refresh tokens
- Role-based access control
- Input validation and sanitization
- Rate limiting and CORS protection
- Security headers and best practices

📚 Documentation:
- Complete deployment guides
- API documentation
- Setup instructions
- Troubleshooting guides"

    git commit -m "$commit_message"
    
    if [ $? -eq 0 ]; then
        print_success "Initial commit created successfully."
    else
        print_error "Failed to create commit."
        exit 1
    fi
}

# Push to GitHub
push_to_github() {
    print_status "Pushing to GitHub..."
    
    # Set main branch and push
    git branch -M main
    
    print_warning "Pushing to GitHub repository..."
    print_warning "You may be prompted for your GitHub credentials."
    
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        print_success "Successfully pushed to GitHub!"
        print_success "Repository URL: https://github.com/taksh1507/GujartEstateAgency"
    else
        print_error "Failed to push to GitHub."
        print_warning "You may need to:"
        print_warning "1. Check your internet connection"
        print_warning "2. Verify your GitHub credentials"
        print_warning "3. Ensure the repository exists and you have access"
        exit 1
    fi
}

# Verify push
verify_push() {
    print_status "Verifying push..."
    
    # Check remote status
    git remote -v
    
    print_success "Push verification completed."
    print_status "Your repository is now available at:"
    print_status "https://github.com/taksh1507/GujartEstateAgency"
}

# Main execution
main() {
    echo
    print_status "Starting GitHub push process..."
    echo
    
    check_git
    check_directory
    
    print_warning "This will push your complete Gujarat Real Estate project to GitHub."
    print_warning "Repository: https://github.com/taksh1507/GujartEstateAgency"
    echo
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Operation cancelled."
        exit 0
    fi
    
    echo
    init_git
    add_remote
    configure_git
    stage_files
    echo
    
    print_status "Files to be committed:"
    git status --short | head -20
    if [ $(git status --short | wc -l) -gt 20 ]; then
        echo "... and $(( $(git status --short | wc -l) - 20 )) more files"
    fi
    echo
    
    read -p "Proceed with commit and push? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Operation cancelled."
        exit 0
    fi
    
    echo
    create_commit
    push_to_github
    verify_push
    
    echo
    print_success "🎉 Gujarat Real Estate project successfully pushed to GitHub!"
    echo
    print_status "Next steps:"
    print_status "1. Visit: https://github.com/taksh1507/GujartEstateAgency"
    print_status "2. Verify all files are present"
    print_status "3. Follow deployment guides to go live"
    print_status "4. Set up branch protection and collaborators"
    echo
    print_success "Happy coding! 🚀"
}

# Run main function
main