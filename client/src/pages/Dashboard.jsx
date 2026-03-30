import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faSeedling,
  faChartLine,
  faCalendarAlt,
  faArrowRight,
  faMapMarkedAlt,
  faWheatAwn,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [recentFields] = useState([
    { id: 1, name: 'North Field', crop: 'Wheat', stage: 'Flowering', progress: 75 },
    { id: 2, name: 'South Field', crop: 'Rice', stage: 'Maturation', progress: 90 },
    { id: 3, name: 'East Field', crop: 'Corn', stage: 'Vegetative', progress: 45 }
  ]);

  const [cropPredictions] = useState([
    { crop: 'Wheat', confidence: 92, recommendedAction: 'Plant in 2 weeks', optimalSeason: 'Winter' },
    { crop: 'Rice', confidence: 88, recommendedAction: 'Wait for monsoon', optimalSeason: 'Kharif' },
    { crop: 'Corn', confidence: 85, recommendedAction: 'Plant after harvest', optimalSeason: 'Summer' }
  ]);

  const [yieldPredictions] = useState([
    { field: 'North Field', crop: 'Wheat', predictedYield: '4.2 tons', harvestDate: '2025-04-15', confidence: 89 },
    { field: 'South Field', crop: 'Rice', predictedYield: '6.8 tons', harvestDate: '2025-11-20', confidence: 94 },
    { field: 'East Field', crop: 'Corn', predictedYield: '5.5 tons', harvestDate: '2025-07-10', confidence: 87 }
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-transparent antialiased">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel px-6 py-6 mb-8 mt-2 shadow-sm border border-white/40"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">{t('pages.dashboard.title')}</h1>
            <p className="text-slate-600 mt-2 text-lg">
              {t('pages.dashboard.welcomeBack')} <span className="font-semibold text-brand-600">{user?.name}</span> | {t('pages.dashboard.manageFieldsSubtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-brand-50/80 px-5 py-3 rounded-xl border border-brand-100 shadow-sm backdrop-blur-sm">
            <FontAwesomeIcon icon={faUser} className="text-brand-600" />
            <span className="text-brand-700 font-bold tracking-wide">{t('pages.dashboard.farmerDashboard')}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="space-y-8"
      >
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="glass-card p-8">
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">{t('pages.dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/create-field"
              className="flex items-center p-5 bg-white/60 rounded-2xl border border-slate-200/60 hover:border-brand-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-brand-500/30">
                <FontAwesomeIcon icon={faPlus} className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{t('pages.dashboard.createNewField')}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t('pages.dashboard.addNewFieldDesc')}</p>
              </div>
            </Link>

            <Link
              to="/crop-lifecycle"
              className="flex items-center p-5 bg-white/60 rounded-2xl border border-slate-200/60 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/30">
                <FontAwesomeIcon icon={faSeedling} className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{t('pages.dashboard.cropLifecycle')}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t('pages.dashboard.trackGrowthStages')}</p>
              </div>
            </Link>

            <Link
              to="/crop-prediction"
              className="flex items-center p-5 bg-white/60 rounded-2xl border border-slate-200/60 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{t('pages.dashboard.cropPrediction')}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t('pages.dashboard.aiPoweredSuggestions')}</p>
              </div>
            </Link>

            <Link
              to="/yield-prediction"
              className="flex items-center p-5 bg-white/60 rounded-2xl border border-slate-200/60 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-orange-500/30">
                <FontAwesomeIcon icon={faWheatAwn} className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{t('pages.dashboard.yieldPrediction')}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t('pages.dashboard.predictHarvest')}</p>
              </div>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Field Overview */}
          <motion.div variants={itemVariants} className="glass-card p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-slate-900">{t('pages.dashboard.recentFields')}</h2>
              <Link to="/create-field" className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 group">
                <FontAwesomeIcon icon={faPlus} className="text-sm" /> 
                <span className="group-hover:underline underline-offset-4">{t('pages.dashboard.addNewField')}</span>
              </Link>
            </div>
            
            {recentFields.length > 0 ? (
              <div className="space-y-4 flex-1">
                {recentFields.map((field) => (
                  <div key={field.id} className="bg-white/50 border border-white/60 rounded-xl p-5 hover:bg-white/80 transition-all duration-300 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-slate-900">{field.name}</h3>
                      <span className="text-xs font-bold bg-brand-100 text-brand-800 px-3 py-1.5 rounded-lg border border-brand-200 shadow-sm uppercase tracking-wider">{field.crop}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-600 font-medium mb-2">
                        <span>{t('pages.dashboard.growthStage')}: <span className="text-slate-900">{field.stage}</span></span>
                        <span className="text-brand-600">{field.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-brand-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${field.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Link 
                        to={`/crop-lifecycle`} 
                        className="text-slate-500 hover:text-brand-600 text-sm font-bold flex items-center gap-2 group transition-colors"
                      >
                        {t('pages.dashboard.viewDetails')} 
                        <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 bg-white/40 rounded-xl border border-dashed border-slate-300 flex-1">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="text-5xl mb-4 text-slate-300" />
                <p className="text-slate-500 mb-4">{t('pages.dashboard.noFieldsCreated')}</p>
                <Link to="/create-field" className="glass-button px-6 py-2.5">
                  {t('pages.dashboard.createFirstField')}
                </Link>
              </div>
            )}
          </motion.div>

          <div className="space-y-8 flex flex-col">
            {/* Crop Predictions */}
            <motion.div variants={itemVariants} className="glass-card p-8 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold text-slate-900">{t('pages.dashboard.aiCropRecommendations')}</h2>
                <Link to="/crop-prediction" className="text-brand-600 hover:text-brand-700 font-bold group">
                  {t('pages.dashboard.viewAll')} <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform inline-block ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {cropPredictions.slice(0,2).map((prediction, index) => (
                  <div key={index} className="bg-white/50 border border-white/60 rounded-xl p-5 shadow-sm hover:bg-white/80 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-slate-900">{prediction.crop}</h3>
                      <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200">
                        {prediction.confidence}% {t('pages.dashboard.confidence')}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium mb-3">{prediction.recommendedAction}</p>
                    <div className="text-sm font-semibold text-slate-500 flex items-center bg-slate-100/80 p-2 rounded-lg inline-block">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-brand-500" />
                      {t('pages.dashboard.bestFor')}: {prediction.optimalSeason}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Yield Predictions */}
            <motion.div variants={itemVariants} className="glass-card p-8 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold text-slate-900">{t('pages.dashboard.yieldPredictions')}</h2>
                <Link to="/yield-prediction" className="text-brand-600 hover:text-brand-700 font-bold group">
                  {t('pages.dashboard.viewDetails')} <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform inline-block ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {yieldPredictions.slice(0,2).map((prediction, index) => (
                  <div key={index} className="bg-white/50 border border-white/60 rounded-xl p-5 shadow-sm hover:bg-white/80 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-slate-900">{prediction.field}</h3>
                      <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg border border-orange-200">
                        {prediction.confidence}% {t('pages.dashboard.accuracy')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/50 text-center">
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{t('pages.dashboard.crop')}</div>
                        <div className="font-bold text-slate-900">{prediction.crop}</div>
                      </div>
                      <div className="bg-brand-50/80 p-3 rounded-lg border border-brand-100 text-center">
                        <div className="text-xs text-brand-600 font-medium uppercase tracking-wider mb-1">{t('pages.dashboard.predictedYield')}</div>
                        <div className="font-bold text-brand-700 text-lg">{prediction.predictedYield}</div>
                      </div>
                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/50 text-center">
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{t('pages.dashboard.harvestDate')}</div>
                        <div className="font-bold text-slate-900">{new Date(prediction.harvestDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
