import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faCalendarAlt,
  faCheckCircle,
  faClockRotateLeft,
  faDroplet,
  faExclamationTriangle,
  faLeaf,
  faSeedling,
  faSpinner,
  faWheatAwn,
  faPlus,
  faCloudSunRain,
  faBug,
  faClipboardCheck,
  faTractor,
  faWater,
  faInfoCircle,
  faVial
} from '@fortawesome/free-solid-svg-icons';

// --- MOCK DATABASE DATA (JSON DATA STRUCTURE) --- //
// This acts as the backend representation of a Crop Model Schema.
const CROP_MODELS = {
  "Wheat": {
    crop_id: "CROP_WHEAT_01",
    crop_name: "Wheat",
    total_duration_days: 120,
    stages: [
      {
        id: 1,
        stage_name: "Germination & Seedling",
        duration_in_days: 15,
        water_requirements: { level: "Medium", value: "30-40%" },
        fertilizer_schedule: "Base application of NPK (Nitrogen, Phosphorus, Potassium)",
        pest_disease_risks: ["Cutworms", "Wireworms"],
        required_farmer_actions: ["Monitor soil moisture", "Check for even germination"],
        icon: faSeedling,
        color: "bg-amber-100 text-amber-700 border-amber-300"
      },
      {
        id: 2,
        stage_name: "Tillering",
        duration_in_days: 25,
        water_requirements: { level: "High", value: "60-70%" },
        fertilizer_schedule: "First top dressing of Nitrogen",
        pest_disease_risks: ["Aphids", "Powdery Mildew"],
        required_farmer_actions: ["Weed control application", "Count tiller density"],
        icon: faLeaf,
        color: "bg-lime-100 text-lime-700 border-lime-300"
      },
      {
        id: 3,
        stage_name: "Vegetative / Jointing",
        duration_in_days: 30,
        water_requirements: { level: "High", value: "70-80%" },
        fertilizer_schedule: "Second top dressing of Nitrogen",
        pest_disease_risks: ["Rust", "Leaf Blight"],
        required_farmer_actions: ["Fungicide spray if humidity is high", "Monitor canopy coverage"],
        icon: faWheatAwn,
        color: "bg-green-100 text-green-700 border-green-300"
      },
      {
        id: 4,
        stage_name: "Flowering",
        duration_in_days: 20,
        water_requirements: { level: "Very High", value: "80-90%" },
        fertilizer_schedule: "Foliar spray of Potassium if deficient",
        pest_disease_risks: ["Head Blight (Scab)", "Armyworms"],
        required_farmer_actions: ["CRITICAL: Ensure adequate watering", "Do not spray herbicides during anthesis"],
        icon: faCloudSunRain, // Fixed reference error
        color: "bg-yellow-100 text-yellow-700 border-yellow-300"
      },
      {
        id: 5,
        stage_name: "Maturation & Harvesting",
        duration_in_days: 30,
        water_requirements: { level: "Low", value: "Dry down" },
        fertilizer_schedule: "None",
        pest_disease_risks: ["Birds", "Rodents"],
        required_farmer_actions: ["Prepare harvesting equipment", "Check grain moisture content (target < 14%)"],
        icon: faTractor,
        color: "bg-orange-100 text-orange-700 border-orange-300"
      }
    ]
  },
  "Sugarcane": {
    crop_id: "CROP_CANE_01",
    crop_name: "Sugarcane",
    total_duration_days: 360,
    stages: [
      {
        id: 1,
        stage_name: "Germination",
        duration_in_days: 45,
        water_requirements: { level: "High", value: "60%" },
        fertilizer_schedule: "Basal dressing: 100% P, 50% K, 33% N",
        pest_disease_risks: ["Termites", "Early Shoot Borer"],
        required_farmer_actions: ["Ensure sets are fully covered", "Pre-emergence herbicide"],
        icon: faSeedling,
        color: "bg-amber-100 text-amber-700 border-amber-300"
      },
      {
        id: 2,
        stage_name: "Tillering (Formative)",
        duration_in_days: 75,
        water_requirements: { level: "Very High", value: "80%" },
        fertilizer_schedule: "Top dressing of Nitrogen at 45 & 90 days",
        pest_disease_risks: ["Internode Borer", "Smut"],
        required_farmer_actions: ["Frequent light irrigation", "Earthing up operation"],
        icon: faLeaf,
        color: "bg-lime-100 text-lime-700 border-lime-300"
      },
      {
        id: 3,
        stage_name: "Grand Growth",
        duration_in_days: 150,
        water_requirements: { level: "Maximum", value: "100%" },
        fertilizer_schedule: "Final Nitrogen application before 120 days",
        pest_disease_risks: ["Red Rot", "Whitefly"],
        required_farmer_actions: ["Detrashing (removing dry leaves)", "Propping (tying canes) to prevent lodging"],
        icon: faLeaf,
        color: "bg-green-100 text-green-700 border-green-300"
      },
      {
        id: 4,
        stage_name: "Ripening & Maturity",
        duration_in_days: 90,
        water_requirements: { level: "Low", value: "Stop 15 days prior" },
        fertilizer_schedule: "None",
        pest_disease_risks: ["Rats", "Scale Insects"],
        required_farmer_actions: ["Stop irrigation to increase sucrose content", "Coordinate with local sugar mill"],
        icon: faTractor,
        color: "bg-orange-100 text-orange-700 border-orange-300"
      }
    ]
  }
};

const CropLifecycle = () => {
  const { t } = useTranslation();
  
  // App States
  const [selectedCropKey, setSelectedCropKey] = useState("Wheat");
  const [sowingDate, setSowingDate] = useState(
    new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 40 days ago
  );
  
  // UI Interactions
  const [activeStageId, setActiveStageId] = useState(null);

  const cropModel = CROP_MODELS[selectedCropKey];

  // --- COMPUTE LIFECYCLE MATH --- //
  const computationParams = useMemo(() => {
    if (!sowingDate) return null;
    
    const start = new Date(sowingDate);
    const today = new Date();
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let daysPassedCount = 0;
    let currentStageObj = null;
    let stagePercentages = [];
    
    const enrichedStages = cropModel.stages.map((stage, idx) => {
      const stageStartDay = daysPassedCount;
      const stageEndDay = daysPassedCount + stage.duration_in_days;
      
      const startDateObj = new Date(start);
      startDateObj.setDate(startDateObj.getDate() + stageStartDay);
      
      const endDateObj = new Date(start);
      endDateObj.setDate(endDateObj.getDate() + stageEndDay);
      
      let status = "upcoming";
      let localProgress = 0;

      if (diffDays >= stageEndDay) {
        status = "completed";
        localProgress = 100;
      } else if (diffDays >= stageStartDay && diffDays < stageEndDay) {
        status = "active";
        currentStageObj = stage;
        localProgress = ((diffDays - stageStartDay) / stage.duration_in_days) * 100;
      } else {
        status = "upcoming";
        localProgress = 0;
      }
      
      daysPassedCount += stage.duration_in_days;
      
      return {
        ...stage,
        startDate: startDateObj,
        endDate: endDateObj,
        status,
        localProgress: Math.max(0, Math.min(100, localProgress))
      };
    });

    const globalPercentage = Math.max(0, Math.min(100, (diffDays / cropModel.total_duration_days) * 100));

    return {
      daysPassed: diffDays,
      globalPercentage,
      enrichedStages,
      currentStageObj: currentStageObj || (diffDays >= cropModel.total_duration_days ? enrichedStages[enrichedStages.length - 1] : enrichedStages[0]),
      isHarvested: diffDays >= cropModel.total_duration_days
    };
  }, [sowingDate, cropModel]);

  // Set the default open card to the currently active stage
  useEffect(() => {
    if (computationParams && computationParams.currentStageObj && !activeStageId) {
      setActiveStageId(computationParams.currentStageObj.id);
    }
  }, [computationParams, activeStageId]);


  if (!computationParams) return null;

  const { daysPassed, globalPercentage, enrichedStages, isHarvested } = computationParams;
  const activeDetailCard = enrichedStages.find(s => s.id === activeStageId) || enrichedStages[0];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in relative z-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/80 p-6 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center">
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent mr-2">
              Lifecycle Tracker
            </span>
            <FontAwesomeIcon icon={faSeedling} className="text-emerald-500 text-2xl" />
          </h1>
          <p className="text-slate-500 font-medium">Dynamically track crop growth stages and smart actions.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto flex-1">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Crop Selection</label>
            <select 
              value={selectedCropKey} 
              onChange={(e) => {
                setSelectedCropKey(e.target.value);
                setActiveStageId(null);
              }}
              className="w-full px-4 py-3 sm:py-2 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all cursor-pointer font-medium text-slate-700"
            >
              {Object.keys(CROP_MODELS).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto flex-1">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Sowing Date</label>
            <input 
              type="date" 
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="w-full px-4 py-3 sm:py-2 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* GLOBAL PROGRESS METRICS */}
      <div className="bg-white/80 p-6 rounded-3xl border border-white/60 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Overall Progress</h3>
            <p className="text-sm text-slate-500 font-medium">Day {Math.max(0, daysPassed)} of {cropModel.total_duration_days}</p>
          </div>
          <span className="text-2xl font-black text-emerald-600 drop-shadow-sm">
            {globalPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 shadow-inner overflow-hidden border border-slate-200">
          <div 
            className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${globalPercentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TIMELINE (LEFT PANE) */}
        <div className="lg:col-span-5 bg-white/80 p-6 md:p-8 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md overflow-hidden relative">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-emerald-600" /> 
            Development Stages
          </h3>
          
          <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-slate-200 before:to-slate-100">
            {enrichedStages.map((stage, idx) => {
              const isActiveNode = stage.status === 'active';
              const isCompleted = stage.status === 'completed';
              const isSelected = activeStageId === stage.id;
              
              return (
                <div 
                  key={stage.id} 
                  className="relative flex items-start gap-4 group cursor-pointer"
                  onClick={() => setActiveStageId(stage.id)}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-[-24px] top-1 w-6 h-6 rounded-full border-4 shadow-sm z-10 flex items-center justify-center transition-all duration-300
                    ${isCompleted ? 'bg-emerald-500 border-emerald-200' : 
                      isActiveNode ? 'bg-amber-500 border-amber-200 scale-125' : 
                      'bg-slate-300 border-white'}`}
                  >
                    {isActiveNode && <div className="absolute w-full h-full rounded-full bg-amber-400 animate-ping opacity-60"></div>}
                  </div>

                  {/* Card content */}
                  <div className={`w-full p-4 rounded-2xl border transition-all duration-300
                    ${isSelected ? 'bg-slate-50 border-slate-300 shadow-md transform scale-[1.02]' : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'}
                  `}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                        ${stage.status === 'active' ? 'bg-amber-100 text-amber-700' :
                          stage.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-500'}  
                      `}>
                        {stage.status}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {stage.duration_in_days} days
                      </span>
                    </div>
                    
                    <h4 className={`text-base font-bold mb-1 ${isActiveNode ? 'text-amber-700' : 'text-slate-800'}`}>
                      {stage.stage_name}
                    </h4>
                    
                    <p className="text-xs text-slate-500 font-medium font-mono">
                      {stage.startDate.toLocaleDateString()} - {stage.endDate.toLocaleDateString()}
                    </p>
                    
                    {/* Stage mini progress bar if active */}
                    {isActiveNode && (
                      <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${stage.localProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE DETAILS DASHBOARD (RIGHT PANE) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Detail Header Card */}
          <div className="bg-white/80 p-6 md:p-8 rounded-3xl border border-white/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 ${activeDetailCard.color}`}>
                <FontAwesomeIcon icon={activeDetailCard.icon} className="text-3xl" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-1">Detailed Stage View</span>
                <h2 className="text-2xl font-black text-slate-800">{activeDetailCard.stage_name}</h2>
              </div>
              
              {activeDetailCard.status === 'active' && (
                <div className="absolute top-0 right-0">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Current Stage
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Checklist */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faClipboardCheck} className="text-emerald-500" /> 
                  Action Items
                </h4>
                <ul className="space-y-3">
                  {activeDetailCard.required_farmer_actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 border-emerald-500 flex items-center justify-center bg-white cursor-pointer hover:bg-emerald-50 transition-colors">
                        {/* Placeholder mock for checkbox effect */}
                        {activeDetailCard.status === 'completed' && <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-xs" />}
                      </div>
                      <span className={`text-sm font-medium ${activeDetailCard.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {act}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resource Indicators */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDroplet} className="text-blue-500" /> Water Needs
                    </h4>
                    <span className="text-xs font-bold bg-white text-blue-700 px-2 py-1 rounded-md shadow-sm border border-blue-100">
                      {activeDetailCard.water_requirements.level}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 opacity-80">{activeDetailCard.water_requirements.value}</p>
                </div>
                
                <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faVial} className="text-teal-500" /> Fertilizer Plan
                  </h4>
                  <p className="text-sm text-teal-800 font-medium">{activeDetailCard.fertilizer_schedule}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Alerts & Integrations Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pest Alerts */}
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <FontAwesomeIcon icon={faBug} className="text-9xl text-red-900" />
              </div>
              <h4 className="text-sm font-bold text-red-800 uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
                <FontAwesomeIcon icon={faBug} className="text-red-500" /> 
                Pest & Disease Risks
              </h4>
              <div className="flex flex-wrap gap-2 relative z-10">
                {activeDetailCard.pest_disease_risks.map((pest, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-200 text-sm font-bold text-red-700 shadow-sm">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 text-xs" />
                    {pest}
                  </span>
                ))}
              </div>
            </div>

            {/* Weather Integration Stub */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 shadow-sm relative">
              <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-widest flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faCloudSunRain} className="text-indigo-500" /> 
                Weather Intelligence
              </h4>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-100/50">
                {activeDetailCard.water_requirements.level === "Dry down" ? (
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 mt-1" />
                    <p className="text-sm font-medium text-slate-700">
                      <strong>AI Alert:</strong> Light rain forecasted next week. Cover harvested crops immediately to prevent moisture rot.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-400 mt-1" />
                    <p className="text-sm font-medium text-slate-700">
                      Optimal conditions expected for the next 7 days. Perfect window for fertilizer application.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
};

export default CropLifecycle;