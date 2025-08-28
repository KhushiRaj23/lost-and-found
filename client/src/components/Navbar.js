import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaPlus, FaList, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, isModerator, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
            🎯 Lost & Found
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              <FaHome className="mr-3" />
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/submit" className="nav-link">
                  <FaPlus className="mr-3" />
                  Submit Item
                </Link>
                <Link to="/my-items" className="nav-link">
                  <FaList className="mr-3" />
                  My Items
                </Link>
                {isModerator && (
                  <Link to="/moderator" className="nav-link text-yellow-400 hover:text-yellow-300">
                    <FaShieldAlt className="mr-3" />
                    Moderator
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4 bg-gray-800 px-6 py-3 rounded-2xl border border-gray-600">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-lg" />
                  </div>
                  <span className="text-gray-300 font-semibold text-lg">{user?.username}</span>
                </div>
                <Link to="/profile" className="btn btn-outline">
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-300 hover:text-blue-400 transition-colors p-3 rounded-xl hover:bg-gray-800"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-700 animate-slideIn">
            <div className="flex flex-col space-y-6">
              <Link 
                to="/" 
                className="nav-link-mobile"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="mr-4" />
                Home
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/submit" 
                    className="nav-link-mobile"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaPlus className="mr-4" />
                    Submit Item
                  </Link>
                  <Link 
                    to="/my-items" 
                    className="nav-link-mobile"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaList className="mr-4" />
                    My Items
                  </Link>
                  {isModerator && (
                    <Link 
                      to="/moderator" 
                      className="nav-link-mobile text-yellow-400 hover:text-yellow-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaShieldAlt className="mr-4" />
                      Moderator
                    </Link>
                  )}
                  <div className="pt-6 border-t border-gray-700">
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-800 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-xl" />
                      </div>
                      <span className="text-gray-300 font-semibold text-lg">{user?.username}</span>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block mb-4 btn btn-outline w-full text-center py-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full btn btn-secondary text-center py-4"
                    >
                      <FaSignOutAlt className="mr-3 inline" />
                      Logout
                    </button>
                  </div>
                </>
              )}
              
              {!isAuthenticated && (
                <div className="pt-6 border-t border-gray-700">
                  <Link 
                    to="/login" 
                    className="block mb-4 btn btn-outline w-full text-center py-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full btn btn-primary text-center py-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
