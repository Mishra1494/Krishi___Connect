import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faCalendarCheck,
  faChartLine,
  faCheckCircle,
  faEquals,
  faExclamationTriangle,
  faFloppyDisk,
  faHistory,
  faLeaf,
  faSpinner,
  faWheatAwn,
  faSun,
  faDroplet,
  faMountainSun,
  faCoins,
  faBullseye,
  faLightbulb,
  faShieldHalved,
  faChartArea
} from '@fortawesome/free-solid-svg-icons';

import {
  createYieldPrediction,
  getCropsByField,
  getUserFields,
  getUserYieldPredictions,
  normalizeField
} from '../services/dataService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const OverviewCard = ({ icon, label, value, caption, colorClass = "text-brand-600", bgClass = "bg-brand-50" }) => (
  <motion.div variants={itemVariants} className="glass-card p-6 flex items-start gap-4 h-full relative overflow-hidden group">
    <div className={`p-4 rounded-2xl ${bgClass} ${colorClass} flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm border border-white/50`}>
      <FontAwesomeIcon icon={icon} className="text-xl sm:text-2xl" />
    </div>
    <div className="z-10">
      <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 leading-tight">{value || '--'}</h3>
      <p className="text-xs sm:text-sm text-slate-500 font-medium">{caption}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.04] transform group-hover:scale-125 transition-transform duration-500 pointer-events-none">
       <FontAwesomeIcon icon={icon} className="text-8xl" />
    </div>
  </motion.div>
);

const ProgressBar = ({ label, percentage, icon, colorClass }) => {
  const bg = colorClass.includes('brand') ? 'bg-brand-500' 
           : colorClass.includes('amber') ? 'bg-amber-500'
           : colorClass.includes('blue') ? 'bg-blue-500'
           : 'bg-emerald-500';

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold flex items-center gap-2 text-slate-700">
          <FontAwesomeIcon icon={icon} className={colorClass} /> {label}
        </span>
        <span className="text-sm font-bold text-slate-800">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-2.5 rounded-full ${bg} relative`}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  );
};

const YieldPrediction = () => {
  const { t, i18n } = useTranslation();
  const [selectedField, setSelectedField] = useState('');
  const [predictionPeriod, setPredictionPeriod] = useState('current-season');
  const [fields, setFields] = useState([]);
  const [fieldCrops, setFieldCrops] = useState([]);
  const [savedPredictions, setSavedPredictions] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFields();
    fetchSavedPredictions();
  }, []);

  useEffect(() => {
    if (selectedField) fetchFieldCrops(selectedField);
  }, [selectedField]);

  const fetchFields = async () => {
    try {
      const res = await getUserFields();
      const mapped = res.data.map(normalizeField);
      setFields(mapped);
      if (mapped.length) setSelectedField(mapped[0].id);
    } catch {
      setError(t('pages.yieldPrediction.failedToLoad', 'Failed to load data'));
    } finally {
      setFieldsLoading(false);
    }
  };

  const fetchFieldCrops = async (id) => {
    try {
      const res = await getCropsByField(id);
      setFieldCrops(res.data || []);
    } catch {
      setFieldCrops([]);
    }
  };

  const fetchSavedPredictions = async () => {
    try {
      const res = await getUserYieldPredictions();
      setSavedPredictions(res.data || []);
    } catch {
      setSavedPredictions([]);
    }
  };

  const currentField = useMemo(
    () => fields.find((f) => f.id === selectedField),
    [fields, selectedField]
  );

  const latestCrop = useMemo(
    () => fieldCrops[0] || null,
    [fieldCrops]
  );

  // Generate mock prediction data augmented with rich UI properties
  const prediction = useMemo(() => {
    if (!currentField) return null;

    const base = 4.5;
    const estPricePerTon = 2800; // Mock price

    return {
      cropName: latestCrop?.crop_name || t('pages.yieldPrediction.wheat', 'Wheat'),
      currentYield: base,
      predictedYield: base + 0.8,
      minYield: base - 0.2,
      maxYield: base + 1.2,
      confidence: 88,
      harvestDate: new Date('2026-06-01').toLocaleDateString(i18n.language || 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysToHarvest: 45,
      trend: 'up',
      price: estPricePerTon,
      projectedRevenue: ((base + 0.8) * currentField.area * estPricePerTon).toLocaleString(),
      factors: {
        weather: 82,
        soil: 90,
        irrigation: 75
      },
      risks: [
        { risk: t('pages.yieldPrediction.riskWeather', 'Mild drought expected late season'), impact: 'Medium', type: 'warning' }
      ],
      recommendations: [
        t('pages.yieldPrediction.rec1', 'Increase irrigation frequency by 10% next month'),
        t('pages.yieldPrediction.rec2', 'Apply nitrogen-based fertilizer within 2 weeks')
      ]
    };
  }, [currentField, latestCrop, i18n.language, t]);

  const handleSave = async () => {
    if (!currentField || !latestCrop) return;
    setSaving(true);
    setSuccessMessage('');
    setError('');
    
    try {
      await createYieldPrediction({ field_id: currentField.id });
      setSuccessMessage(t('pages.yieldPrediction.saved', 'Prediction saved successfully!'));
      fetchSavedPredictions();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch {
      setError(t('pages.yieldPrediction.saveFailed', 'Failed to save prediction.'));
    } finally {
      setSaving(false);
    }
  };

  if (fieldsLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-brand-500" />
          <p className="text-slate-500 font-medium animate-pulse">{t('common.loading', 'Loading data...')}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 flex items-center gap-3">
            <span className="bg-brand-100 text-brand-600 p-2.5 rounded-xl shadow-sm border border-brand-200/50">
              <FontAwesomeIcon icon={faChartArea} />
            </span>
            {t('pages.yieldPrediction.title', 'AI Yield Prediction')}
          </h1>
          <p className="mt-2 text-slate-500">
            {t('pages.yieldPrediction.subtitle', 'Advanced agritech modeling based on local factors and realtime data.')}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1 sm:flex-initial">
             <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
               {t('pages.yieldPrediction.selectField', 'Target Field')}
             </label>
             <select
               value={selectedField}
               onChange={(e) => setSelectedField(e.target.value)}
               className="glass-input px-4 py-2.5 min-w-[200px] font-medium text-slate-800 shadow-sm"
             >
               {fields.map((f) => (
                 <option key={f.id} value={f.id}>{f.name}</option>
               ))}
             </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 sm:flex-initial">
             <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
               {t('pages.yieldPrediction.forecastPeriod', 'Forecast Period')}
             </label>
             <select
               value={predictionPeriod}
               onChange={(e) => setPredictionPeriod(e.target.value)}
               className="glass-input px-4 py-2.5 min-w-[160px] font-medium text-slate-800 shadow-sm"
             >
               <option value="current-season">{t('pages.yieldPrediction.currentSeason', 'Current Season')}</option>
               <option value="next-season">{t('pages.yieldPrediction.nextSeason', 'Next Season')}</option>
               <option value="annual">{t('pages.yieldPrediction.annualForecast', 'Annual')}</option>
             </select>
          </div>
        </div>
      </div>

      {!currentField ? (
         <div className="text-center p-12 glass-panel border-dashed border-2 border-slate-300">
           <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-amber-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-800 mb-2">{t('pages.yieldPrediction.noFieldsFound', 'No Fields Found')}</h3>
           <p className="text-slate-500">{t('pages.yieldPrediction.addFieldPrompt', 'Please add a field to your dashboard to generate predictions.')}</p>
         </div>
      ) : (
        <>
          {/* Top Overview Cards */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OverviewCard
              icon={faMountainSun}
              label={t('pages.yieldPrediction.field', 'Active Field')}
              value={currentField.name}
              caption={`${currentField.area} ${t('pages.yieldPrediction.hectare', 'hectares')}`}
              bgClass="bg-blue-50" colorClass="text-blue-600"
            />
            <OverviewCard
              icon={faWheatAwn}
              label={t('pages.yieldPrediction.crop', 'Current Crop')}
              value={prediction?.cropName}
              caption={t('pages.yieldPrediction.activeCrop', 'Currently Growing')}
              bgClass="bg-brand-50" colorClass="text-brand-600"
            />
            <OverviewCard
              icon={faCoins}
              label={t('pages.yieldPrediction.estRevenue', 'Est. Gross Revenue')}
              value={`₹${prediction?.projectedRevenue}`}
              caption={`@ ₹${prediction?.price.toLocaleString()} / ${t('pages.yieldPrediction.ton', 'Ton')}`}
              bgClass="bg-emerald-50" colorClass="text-emerald-600"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Focal Card - Predicted Yield */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              <div className="glass-card p-8 border-t-4 border-t-brand-500 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 font-heading">
                      {t('pages.yieldPrediction.forecastResult', 'Yield Forecast Result')}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{t('pages.yieldPrediction.forecastBasedOn', 'Based on agritech models & current conditions')}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200">
                    <FontAwesomeIcon icon={faBullseye} />
                    {prediction?.confidence}% {t('pages.yieldPrediction.confidence', 'Confidence')}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10">
                  {/* Huge Number */}
                  <div className="text-center p-8 bg-slate-50 rounded-full border border-slate-200 shadow-inner w-56 h-56 flex flex-col items-center justify-center relative">
                    <div className="absolute inset-x-0 -top-2 flex justify-center">
                       <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-emerald-200 flex items-center gap-1 z-10">
                         <FontAwesomeIcon icon={faArrowUp} /> {t('pages.yieldPrediction.trendingUp', 'Trending Up')}
                       </span>
                    </div>
                    <span className="text-5xl font-extrabold text-slate-800 font-heading mb-2">
                      {prediction?.predictedYield}
                    </span>
                    <span className="text-slate-500 font-medium uppercase tracking-widest text-sm">
                      {t('pages.yieldPrediction.tPerHa', 'Tons / Ha')}
                    </span>
                  </div>

                  {/* Range & Harvest */}
                  <div className="flex-1 w-full space-y-6">
                    <div>
                       <div className="flex justify-between text-sm font-semibold mb-2">
                         <span className="text-slate-500">{t('pages.yieldPrediction.expectedRange', 'Expected Range')}</span>
                         <span className="text-slate-800">{prediction?.minYield} - {prediction?.maxYield} {t('pages.yieldPrediction.tHa', 'T/Ha')}</span>
                       </div>
                       <div className="h-4 bg-slate-100 rounded-full w-full relative overflow-hidden shadow-inner border border-slate-200">
                         {/* Scale bar visualizing min and max across a slightly wider supposed range */}
                         <div className="absolute left-[20%] right-[20%] inset-y-0 bg-brand-200 rounded-full"></div>
                         {/* The exact predicted mark */}
                         <div className="absolute left-[50%] inset-y-0 w-1 bg-brand-600 rounded-full shadow-md z-10 transform -translate-x-1/2"></div>
                       </div>
                       <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                         <span>{t('pages.yieldPrediction.worstCase', 'Worst Case')}</span>
                         <span>{t('pages.yieldPrediction.avg', 'Avg')}</span>
                         <span>{t('pages.yieldPrediction.bestCase', 'Best Case')}</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">{t('pages.yieldPrediction.estHarvest', 'Est. Harvest')}</p>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                           <FontAwesomeIcon icon={faCalendarCheck} className="text-brand-500" />
                           {prediction?.harvestDate}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">{t('pages.yieldPrediction.timeRemaining', 'Time Remaining')}</p>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                           <FontAwesomeIcon icon={faHistory} className="text-blue-500" />
                           {prediction?.daysToHarvest} {t('pages.yieldPrediction.days', 'Days')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Factors & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <FontAwesomeIcon icon={faDroplet} className="text-brand-500" /> 
                      {t('pages.yieldPrediction.envFactors', 'Environmental Factors')}
                    </h3>
                    <ProgressBar label={t('pages.yieldPrediction.weatherCondition', 'Weather Condition')} percentage={prediction?.factors.weather} icon={faSun} colorClass="text-amber-500" />
                    <ProgressBar label={t('pages.yieldPrediction.soilQuality', 'Soil Quality')} percentage={prediction?.factors.soil} icon={faMountainSun} colorClass="text-emerald-600" />
                    <ProgressBar label={t('pages.yieldPrediction.irrigationLevel', 'Irrigation Level')} percentage={prediction?.factors.irrigation} icon={faDroplet} colorClass="text-blue-500" />
                  </div>
                </div>

                <div className="glass-card p-6 shadow-sm flex flex-col justify-between">
                   <div>
                     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                       <FontAwesomeIcon icon={faShieldHalved} className="text-rose-500" /> 
                       {t('pages.yieldPrediction.intelligenceInsights', 'Intelligence Insights')}
                     </h3>
                     <div className="space-y-3">
                       {prediction?.risks.map((r, idx) => (
                         <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200/60">
                           <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 mt-0.5" />
                           <div>
                             <p className="text-sm font-bold text-slate-800">{t('pages.yieldPrediction.identifiedRisk', 'Identified Risk')}</p>
                             <p className="text-xs text-slate-600 leading-relaxed">{r.risk}</p>
                           </div>
                         </div>
                       ))}
                       {prediction?.recommendations.map((rec, idx) => (
                         <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200/60">
                           <FontAwesomeIcon icon={faLightbulb} className="text-blue-500 mt-0.5" />
                           <div>
                             <p className="text-xs font-semibold text-slate-700 leading-relaxed">{rec}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar / Saved Predictions */}
            <motion.div variants={itemVariants} className="space-y-6">
               <div className="glass-card p-6 shadow-sm h-full flex flex-col">
                 <h3 className="font-bold text-slate-800 mb-4 font-heading flex items-center gap-2">
                   <FontAwesomeIcon icon={faFloppyDisk} className="text-slate-400" />
                   {t('pages.yieldPrediction.savedProfiles', 'Saved Profiles')}
                 </h3>
                 
                 <div className="flex-1 flex flex-col overflow-y-auto pr-2 gap-3 mb-6 scrollbar-none">
                   {savedPredictions.length > 0 ? (
                     savedPredictions.map((sp, i) => (
                       <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-brand-300 transition-colors cursor-pointer group">
                         <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{t('pages.yieldPrediction.yield', 'Yield')}: {sp.predicted_yield || 5.1} T</span>
                           <span className="text-xs font-semibold text-slate-400">{new Date(sp.created_at).toLocaleDateString()}</span>
                         </div>
                         <div className="flex gap-2">
                           <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase">{sp.field_name || t('pages.yieldPrediction.fieldWord', 'Field')}</span>
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl">
                       <FontAwesomeIcon icon={faHistory} className="text-3xl mb-2 opacity-50" />
                       <p className="text-sm text-center">{t('pages.yieldPrediction.noSaved', 'No saved predictions yet.')}</p>
                     </div>
                   )}
                 </div>

                 {/* Save Action */}
                 <div className="pt-4 border-t border-slate-100">
                   <button
                     onClick={handleSave}
                     disabled={saving}
                     className="glass-button w-full py-4 text-lg flex items-center justify-center gap-3 relative overflow-hidden"
                   >
                     {saving ? (
                       <><FontAwesomeIcon icon={faSpinner} spin /> {t('pages.yieldPrediction.saving', 'Saving Snapshot...')}</>
                     ) : (
                       <><FontAwesomeIcon icon={faFloppyDisk} /> {t('pages.yieldPrediction.saveCurrent', 'Save Current Forecast')}</>
                     )}
                   </button>
                   
                   {/* Feedback Messages */}
                   {successMessage && (
                     <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm font-bold text-emerald-600 mt-3 flex justify-center items-center gap-2">
                       <FontAwesomeIcon icon={faCheckCircle} /> {successMessage}
                     </motion.p>
                   )}
                   {error && (
                     <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm font-bold text-rose-500 mt-3 flex justify-center items-center gap-2">
                       <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
                     </motion.p>
                   )}
                 </div>
               </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default YieldPrediction;
