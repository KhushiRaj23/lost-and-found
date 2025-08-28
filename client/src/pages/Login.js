import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaUser, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-secondary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-success opacity-10 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6 shadow-xl">
            <FaShieldAlt className="text-white text-3xl" />
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-3">
            Welcome Back
          </h2>
          <p className="text-text-secondary text-lg">
            Sign in to your Lost & Found account
          </p>
        </div>

        <div className="card glass border-2 border-border-primary shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted text-lg" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input pl-12 text-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted text-lg" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pl-12 text-lg"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <FaSignInAlt className="mr-3" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-text-accent hover:text-white font-semibold transition-colors duration-300">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="card glass border border-border-accent">
          <h3 className="text-lg font-semibold text-text-primary mb-3 text-center">
            Demo Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Moderator:</span>
              <span className="text-text-secondary font-mono">moderator@example.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Password:</span>
              <span className="text-text-secondary font-mono">moderator123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
