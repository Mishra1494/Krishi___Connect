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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
            <FontAwesomeIcon icon={faLeaf} className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pages.login.welcomeBack')}</h1>
          <p className="text-gray-600">{t('pages.login.subtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">{t('pages.login.loginAs')}:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleUserTypeChange('farmer')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.userType === 'farmer'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="text-2xl mb-2" />
                <div className="text-sm font-medium">{t('pages.login.farmer')}</div>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('government')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.userType === 'government'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={faBuilding} className="text-2xl mb-2" />
                <div className="text-sm font-medium">{t('pages.login.government')}</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.login.emailLabel')}
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder={t('pages.login.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.login.passwordLabel')}
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder={t('pages.login.passwordPlaceholder')}
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
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                formData.userType === 'farmer'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  {t('pages.login.signingIn')}
                </div>
              ) : (
                `${t('pages.login.signInAs')} ${formData.userType === 'farmer' ? t('pages.login.farmer') : t('pages.login.government')}`
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('pages.login.noAccount')}{' '}
              <Link 
                to="/signup" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {t('pages.login.signUpHere')}
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
