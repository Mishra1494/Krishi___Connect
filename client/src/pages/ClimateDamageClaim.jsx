import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudSunRain, faCamera, faUpload, faCalendarAlt,
  faUser, faPhone, faMapMarkerAlt, faRupeeSign,
  faFileImage, faTrash, faSearch, faTimes,
  faExclamationTriangle, faInfoCircle, faCheck,
  faSpinner, faCrop, faHome, faWater
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const ClimateDamageClaim = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    farmerName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    farmLocation: '',
    incidentDate: '',
    damageType: '',
    cropType: '',
    affectedArea: '',
    estimatedLoss: '',
    description: '',
    weatherCondition: '',
    severityLevel: '',
    duration: '',
    photos: [],
    documents: [],
    selectedScheme: '',
    claimAmount: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showSchemeSearch, setShowSchemeSearch] = useState(false);

  const availableSchemes = [
    {
      id: 'pmfby',
      name: t('pages.climateDamageClaim.schemes.pmfby.name', 'Pradhan Mantri Fasal Bima Yojana (PMFBY)'),
      maxAmount: '₹2,00,000',
      description: t('pages.climateDamageClaim.schemes.pmfby.description', 'Comprehensive crop insurance for weather-related losses'),
      eligibility: t('pages.climateDamageClaim.schemes.pmfby.eligibility', 'All farmers growing notified crops')
    },
    {
      id: 'wbcis',
      name: t('pages.climateDamageClaim.schemes.wbcis.name', 'Weather Based Crop Insurance Scheme (WBCIS)'),
      maxAmount: '₹1,50,000',
      description: t('pages.climateDamageClaim.schemes.wbcis.description', 'Insurance based on weather parameters'),
      eligibility: t('pages.climateDamageClaim.schemes.wbcis.eligibility', 'Farmers affected by adverse weather')
    },
    {
      id: 'nais',
      name: t('pages.climateDamageClaim.schemes.nais.name', 'National Agricultural Insurance Scheme (NAIS)'),
      maxAmount: '₹1,00,000',
      description: t('pages.climateDamageClaim.schemes.nais.description', 'Basic crop insurance for natural calamities'),
      eligibility: t('pages.climateDamageClaim.schemes.nais.eligibility', 'Small and marginal farmers')
    },
    {
      id: 'disaster-relief',
      name: t('pages.climateDamageClaim.schemes.disaster.name', 'State Disaster Relief Fund'),
      maxAmount: '₹50,000',
      description: t('pages.climateDamageClaim.schemes.disaster.description', 'Emergency relief for climate disasters'),
      eligibility: t('pages.climateDamageClaim.schemes.disaster.eligibility', 'Farmers in disaster-declared areas')
    },
    {
      id: 'kisan-credit',
      name: t('pages.climateDamageClaim.schemes.kcc.name', 'Kisan Credit Card Scheme'),
      maxAmount: '₹3,00,000',
      description: t('pages.climateDamageClaim.schemes.kcc.description', 'Credit support for crop recovery'),
      eligibility: t('pages.climateDamageClaim.schemes.kcc.eligibility', 'KCC holders with valid insurance')
    }
  ];

  const damageTypes = [
    t('pages.climateDamageClaim.damageTypes.flood', 'Flood'),
    t('pages.climateDamageClaim.damageTypes.drought', 'Drought'),
    t('pages.climateDamageClaim.damageTypes.hailstorm', 'Hailstorm'),
    t('pages.climateDamageClaim.damageTypes.cyclone', 'Cyclone'),
    t('pages.climateDamageClaim.damageTypes.heavyRain', 'Heavy Rainfall'),
    t('pages.climateDamageClaim.damageTypes.unseasonalRain', 'Unseasonal Rainfall'),
    t('pages.climateDamageClaim.damageTypes.frost', 'Frost'),
    t('pages.climateDamageClaim.damageTypes.heatWave', 'Heat Wave'),
    t('pages.climateDamageClaim.damageTypes.pestAttack', 'Pest Attack due to Weather'),
    t('pages.climateDamageClaim.damageTypes.disease', 'Disease due to Weather'),
    t('pages.climateDamageClaim.damageTypes.other', 'Other')
  ];

  const cropTypes = [
    t('pages.cropPrediction.rice', 'Rice'), t('pages.cropPrediction.wheat', 'Wheat'),
    t('pages.cropPrediction.sugarcane', 'Sugarcane'), t('pages.cropPrediction.cotton', 'Cotton'),
    t('pages.cropPrediction.maize', 'Maize'), t('pages.cropPrediction.bajra', 'Bajra'),
    t('pages.cropPrediction.jowar', 'Jowar'), t('pages.cropPrediction.barley', 'Barley'),
    t('pages.cropPrediction.gram', 'Gram'), t('pages.cropPrediction.tur', 'Tur'),
    t('pages.cropPrediction.moong', 'Moong'), t('pages.cropPrediction.urad', 'Urad'),
    t('pages.cropPrediction.groundnut', 'Groundnut'), t('pages.cropPrediction.soybean', 'Soybean'),
    t('pages.cropPrediction.sunflower', 'Sunflower'), t('pages.cropPrediction.mustard', 'Mustard'),
    t('pages.climateDamageClaim.damageTypes.other', 'Other')
  ];

  const severityLevels = [
    { value: 'mild', label: t('pages.climateDamageClaim.severity.mild', 'Mild (0-25% damage)'), color: 'text-yellow-600' },
    { value: 'moderate', label: t('pages.climateDamageClaim.severity.moderate', 'Moderate (25-50% damage)'), color: 'text-orange-600' },
    { value: 'severe', label: t('pages.climateDamageClaim.severity.severe', 'Severe (50-75% damage)'), color: 'text-red-600' },
    { value: 'complete', label: t('pages.climateDamageClaim.severity.complete', 'Complete (75-100% damage)'), color: 'text-red-800' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileData]
    }));
  };

  const removeFile = (id, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const filteredSchemes = availableSchemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSchemeSelect = (scheme) => {
    setFormData(prev => ({
      ...prev,
      selectedScheme: scheme.id,
      claimAmount: scheme.maxAmount
    }));
    setShowSchemeSearch(false);
    setSearchQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const claimData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        claimId: `CLM${Date.now()}`
      };
      
      console.log('Claim submitted:', claimData);
      setSubmitStatus('success');
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      console.error('Claim submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSchemeDetails = availableSchemes.find(s => s.id === formData.selectedScheme);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FontAwesomeIcon icon={faCloudSunRain} className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('pages.climateDamageClaim.title', 'Climate Damage Claim')}</h1>
              <p className="text-gray-600 mt-1">
                {t('pages.climateDamageClaim.subtitle', 'File a claim for crop damages due to climate change or extreme weather events')}
              </p>
            </div>
          </div>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-3" />
              <div>
                <h3 className="text-green-800 font-medium">{t('pages.climateDamageClaim.submitSuccess', 'Claim Submitted Successfully!')}</h3>
                <p className="text-green-700 text-sm mt-1">
                  {t('pages.climateDamageClaim.submitSuccessDesc', 'Your claim has been submitted and is under review. You will receive updates via email and SMS.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">{t('pages.climateDamageClaim.submitFail', 'Submission Failed')}</h3>
                <p className="text-red-700 text-sm mt-1">
                  {t('pages.climateDamageClaim.submitFailDesc', 'There was an error submitting your claim. Please try again or contact support.')}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-600" />
              {t('pages.climateDamageClaim.personalInfo', 'Personal Information')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.farmerName', 'Farmer Name')} *
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.email', 'Email Address')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.phone', 'Phone Number')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.farmLocation', 'Farm Location')} *
                </label>
                <input
                  type="text"
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleInputChange}
                  placeholder={t('pages.climateDamageClaim.locationPlaceholder', 'Village, District, State')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.climateDamageClaim.address', 'Complete Address')} *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Damage Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-orange-600" />
              {t('pages.climateDamageClaim.damageDetails', 'Damage Details')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.incidentDate', 'Incident Date')} *
                </label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.damageType', 'Type of Damage')} *
                </label>
                <select
                  name="damageType"
                  value={formData.damageType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">{t('pages.climateDamageClaim.selectDamage', 'Select damage type')}</option>
                  {damageTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.cropType', 'Crop Type')} *
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">{t('pages.climateDamageClaim.selectCrop', 'Select crop type')}</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.affectedArea', 'Affected Area (in acres)')} *
                </label>
                <input
                  type="number"
                  name="affectedArea"
                  value={formData.affectedArea}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.estLoss', 'Estimated Loss')} (₹) *
                </label>
                <input
                  type="number"
                  name="estimatedLoss"
                  value={formData.estimatedLoss}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.climateDamageClaim.severityLevel', 'Severity Level')} *
                </label>
                <select
                  name="severityLevel"
                  value={formData.severityLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">{t('pages.climateDamageClaim.selectSeverity', 'Select severity')}</option>
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.climateDamageClaim.descLabel', 'Detailed Description of Damage')} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder={t('pages.climateDamageClaim.descPlaceholder', 'Describe the damage in detail, including what caused it and its impact on your crops...')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Scheme Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="mr-2 text-green-600" />
              {t('pages.climateDamageClaim.selectScheme', 'Select Government Scheme')}
            </h2>
            
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowSchemeSearch(!showSchemeSearch)}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                {selectedSchemeDetails ? 
                  `${t('pages.climateDamageClaim.selected', 'Selected')}: ${selectedSchemeDetails.name}` : 
                  t('pages.climateDamageClaim.searchScheme', 'Search and Select Applicable Scheme')
                }
              </button>
            </div>

            {showSchemeSearch && (
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder={t('pages.climateDamageClaim.searchPlaceholder', 'Search schemes...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredSchemes.map(scheme => (
                    <div
                      key={scheme.id}
                      onClick={() => handleSchemeSelect(scheme)}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{scheme.name}</h4>
                        <span className="text-green-600 font-semibold">{scheme.maxAmount}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{scheme.description}</p>
                      <p className="text-xs text-blue-600">{scheme.eligibility}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSchemeDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">{t('pages.climateDamageClaim.selectedDetails', 'Selected Scheme Details')}:</h4>
                <div className="text-sm text-green-700">
                  <p><strong>{t('pages.climateDamageClaim.name', 'Name')}:</strong> {selectedSchemeDetails.name}</p>
                  <p><strong>{t('pages.climateDamageClaim.maxAmount', 'Maximum Amount')}:</strong> {selectedSchemeDetails.maxAmount}</p>
                  <p><strong>{t('pages.climateDamageClaim.description', 'Description')}:</strong> {selectedSchemeDetails.description}</p>
                  <p><strong>{t('pages.climateDamageClaim.eligibility', 'Eligibility')}:</strong> {selectedSchemeDetails.eligibility}</p>
                </div>
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faCamera} className="mr-2 text-purple-600" />
              {t('pages.climateDamageClaim.uploadPhotos', 'Upload Photos of Damage')} *
            </h2>
            
            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'photos')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={faUpload} className="text-2xl mb-2" />
                <div>{t('pages.climateDamageClaim.clickUpload', 'Click to upload photos or drag and drop')}</div>
                <div className="text-sm text-gray-500 mt-1">{t('pages.climateDamageClaim.uploadLimit', 'PNG, JPG up to 10MB each')}</div>
              </button>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.photos.map(photo => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(photo.id, 'photos')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                    <div className="text-xs text-gray-600 mt-1 truncate">{photo.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
                {t('pages.climateDamageClaim.infoVerify', 'All information will be verified by government officials')}
              </div>
              <button
                type="submit"
                disabled={isLoading || !formData.photos.length}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    {t('common.submitting', 'Submitting...')}
                  </div>
                ) : (
                  t('pages.climateDamageClaim.submitBtn', 'Submit Claim')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClimateDamageClaim;