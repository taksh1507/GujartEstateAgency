import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building2, Info, Mail, Phone, User, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const location = useLocation();

  const baseNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Properties', path: '/properties', icon: Building2 },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Services', path: '/services', icon: Building2 },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];
  
  // Only show Profile when authenticated
  const navItems = isAuthenticated 
    ? [...baseNavItems, { name: 'Profile', path: '/profile', icon: User }]
    : baseNavItems;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-white" />
            <span className="text-white font-bold text-xl">Gujarat Estate Agency</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-white hover:text-secondary transition-colors duration-200 font-medium ${
                  isActive(item.path) ? 'text-secondary' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-white hover:text-secondary transition-colors duration-200 font-medium"
                    >
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span>{user?.firstName || 'User'}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                        >
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-1 text-white hover:text-secondary transition-colors duration-200 font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200 font-medium"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </button>
                </>
              )}
              
              <a
                href="tel:+91-9876543210"
                className="flex items-center space-x-1 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-secondary transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-primary border-t border-blue-600"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 text-white hover:text-secondary hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path) ? 'text-secondary bg-blue-700' : ''
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Auth Buttons for Mobile */}
            <div className="border-t border-blue-600 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-white px-3 py-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <span>Welcome, {user?.firstName || 'User'}!</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 text-white hover:text-secondary hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full mt-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 text-white hover:text-secondary hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 w-full"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-secondary text-white px-3 py-2 rounded-md hover:bg-amber-600 transition-colors duration-200 font-medium mt-2 w-full"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </button>
                </>
              )}
            </div>
            
            <a
              href="tel:+91-9876543210"
              className="flex items-center space-x-2 bg-white text-primary px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium mt-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call Now</span>
            </a>
          </div>
        </motion.div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </nav>
  );
};

export default Navbar;