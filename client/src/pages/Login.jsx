import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faLock, faEye, faEyeSlash,
  faUser, faBuilding, faLeaf, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'farmer' // default to farmer
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.email, formData.password, formData.userType);
    
    if (result.success) {
      // Redirect based on user type
      if (formData.userType === 'farmer') {
        navigate('/dashboard');
      } else {
        navigate('/government-dashboard');
      }
    } else {
      setError(result.error || t('pages.login.loginFailed'));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-2xl mb-6 shadow-lg shadow-brand-500/30 hover:scale-105 transition-transform">
            <FontAwesomeIcon icon={faLeaf} className="text-white text-3xl" />
          </Link>
          <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-slate-600 text-lg">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 md:p-10 shadow-2xl border border-white/50">
          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Login as:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleUserTypeChange('farmer')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.userType === 'farmer'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 shadow-sm'
                    : 'border-white/50 bg-white/40 hover:bg-white/60 text-slate-600'
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="text-2xl mb-2" />
                <div className="text-sm font-medium">Farmer</div>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('government')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.userType === 'government'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm'
                    : 'border-white/50 bg-white/40 hover:bg-white/60 text-slate-600'
                }`}
              >
                <FontAwesomeIcon icon={faBuilding} className="text-2xl mb-2" />
                <div className="text-sm font-medium">Government</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3.5 glass-input text-slate-900"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faLock} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3.5 glass-input text-slate-900"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-4 rounded-xl font-bold transition-all mt-4 ${
                formData.userType === 'farmer'
                  ? 'glass-button'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed text-lg`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                `Sign in as ${formData.userType === 'farmer' ? 'Farmer' : 'Government'}`
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center pt-6 border-t border-slate-200/50">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-brand-600 hover:text-brand-700 font-bold transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800 text-center">
            <strong>{t('pages.login.demo')}:</strong> {t('pages.login.demoNote')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
