import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faCloudRain,
  faIndianRupeeSign,
  faSeedling,
  faCalendarCheck,
  faCheckCircle,
  faTriangleExclamation,
  faMapMarkerAlt,
  faBolt,
  faWater,
  faWind,
  faSun,
  faSnowflake,
  faFire,
  faBug,
  faPhone,
  faGlobe,
  faMobileAlt,
  faComments,
  faChevronDown,
  faChevronUp,
  faInfoCircle,
  faLeaf,
  faMoneyBillWave,
  faStar
} from '@fortawesome/free-solid-svg-icons';

// ─── REGIONAL DATA ────────────────────────────────────────────────────────────

const disasterIcons = {
  Flood: faWater,
  Drought: faSun,
  Cyclone: faWind,
  Hailstorm: faSnowflake,
  'Pest Attack': faBug,
  Fire: faFire,
  Landslide: faTriangleExclamation,
  'Cold Wave': faSnowflake,
  Cloudburst: faCloudRain,
  'Heat Wave': faSun
};

const colorMap = {
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-400' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' }
};

const riskColors = {
  'Very High': 'bg-red-100 text-red-700',
  'High': 'bg-orange-100 text-orange-700',
  'Moderate': 'bg-yellow-100 text-yellow-700'
};

const CropInsuranceSuggestions = () => {
  const { t } = useTranslation();
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');

  // ─── DATA WRAPPED IN USEMEMO FOR I18N ──────────────────────────────────────

  const insurancePlans = useMemo(() => [
    {
      id: 'pmfby',
      name: 'PMFBY',
      fullName: t('pages.insurance.pmfby.fullName', 'Pradhan Mantri Fasal Bima Yojana'),
      coverageType: t('pages.insurance.pmfby.coverage', 'Yield + Prevented Sowing + Post-harvest + Mid-season adversity'),
      premiumKharif: t('pages.insurance.pmfby.kharif', '2% of Sum Insured (max)'),
      premiumRabi: t('pages.insurance.pmfby.rabi', '1.5% of Sum Insured (max)'),
      premiumHorti: t('pages.insurance.pmfby.horti', '5% of Sum Insured (max)'),
      examplePremium: t('pages.insurance.pmfby.example', '₹1,000 on ₹50,000 insured (Kharif)'),
      claimWindow: t('pages.insurance.pmfby.claimWindow', 'Within 72 hours of damage event'),
      claimSettlement: t('pages.insurance.pmfby.settlement', 'Within 2 months of harvest'),
      sumInsured: t('pages.insurance.pmfby.sumInsured', 'Equal to Scale of Finance per hectare (avg. ₹40,700/ha)'),
      govtSubsidy: t('pages.insurance.pmfby.subsidy', '95–98% of actual premium'),
      portalLink: 'pmfby.gov.in',
      helpline: '14447',
      idealFor: t('pages.insurance.pmfby.ideal', 'Small & marginal farmers growing food, oilseed, or horticultural crops'),
      pros: [
        t('pages.insurance.pmfby.pro1', 'Lowest farmer premium in India (as low as ₹1 in some states like Maharashtra)'),
        t('pages.insurance.pmfby.pro2', 'Covers pre-sowing to post-harvest losses'),
        t('pages.insurance.pmfby.pro3', 'Government-funded: ₹69,515 crore allocated for FY22–26'),
        t('pages.insurance.pmfby.pro4', 'Voluntary since 2020; KCC farmers auto-enrolled'),
        t('pages.insurance.pmfby.pro5', 'YES-TECH satellite-based claim verification since Kharif 2023')
      ],
      caution: t('pages.insurance.pmfby.caution', 'Claim confirmation requires state-level survey. 72-hour reporting is mandatory — missing it can mean rejection.'),
      tag: t('pages.insurance.tags.popular', 'Most Popular'),
      tagColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'rwbcis',
      name: 'RWBCIS',
      fullName: t('pages.insurance.rwbcis.fullName', 'Restructured Weather Based Crop Insurance Scheme'),
      coverageType: t('pages.insurance.rwbcis.coverage', 'Rainfall deficit/excess · Temperature extremes · Humidity · Wind speed'),
      premiumKharif: t('pages.insurance.rwbcis.kharif', '2% of Sum Insured (food & oilseeds)'),
      premiumRabi: t('pages.insurance.rwbcis.rabi', '1.5% of Sum Insured (food & oilseeds)'),
      premiumHorti: t('pages.insurance.rwbcis.horti', '5% of Sum Insured (commercial/horticulture)'),
      examplePremium: t('pages.insurance.rwbcis.example', '₹1,500 on ₹75,000 insured (horticulture Kharif)'),
      claimWindow: t('pages.insurance.rwbcis.claimWindow', 'Auto-triggered — no intimation required'),
      claimSettlement: t('pages.insurance.rwbcis.settlement', '45 days after trigger event'),
      sumInsured: t('pages.insurance.rwbcis.sumInsured', 'Based on state govt. payout structure per crop/district'),
      govtSubsidy: t('pages.insurance.rwbcis.subsidy', 'Centre + State share remaining after farmer premium'),
      portalLink: 'pmfby.gov.in',
      helpline: '14447',
      idealFor: t('pages.insurance.rwbcis.ideal', 'Rain-fed areas; horticulture farmers growing grapes, pomegranate, tomato, banana'),
      pros: [
        t('pages.insurance.rwbcis.pro1', 'No field inspection needed — weather station data auto-settles'),
        t('pages.insurance.rwbcis.pro2', 'Covers rainfall deficit, excess rain, high/low temperatures, humidity'),
        t('pages.insurance.rwbcis.pro3', 'Add-on for hailstorm & cloudburst available'),
        t('pages.insurance.rwbcis.pro4', 'Implemented across Maharashtra, Rajasthan, MP, Karnataka, AP and more'),
        t('pages.insurance.rwbcis.pro5', 'Ideal for horticultural crops where PMFBY coverage is limited')
      ],
      caution: t('pages.insurance.rwbcis.caution', 'Payout linked to weather station readings, not actual field loss (basis risk). Choose only if weather station is within 10–15 km.'),
      tag: t('pages.insurance.tags.weather', 'Weather-Based'),
      tagColor: 'bg-sky-100 text-sky-700'
    },
    {
      id: 'localized',
      name: t('pages.insurance.localized.name', 'Localized Peril'),
      fullName: t('pages.insurance.localized.fullName', 'Localized Peril Insurance (Add-on under PMFBY)'),
      coverageType: t('pages.insurance.localized.coverage', 'Hailstorm · Landslide · Inundation · Cloudburst · Flash floods'),
      premiumKharif: t('pages.insurance.localized.kharif', '3%–7% of Sum Insured'),
      premiumRabi: t('pages.insurance.localized.rabi', '3%–7% of Sum Insured'),
      premiumHorti: t('pages.insurance.localized.horti', '5%–8% of Sum Insured'),
      examplePremium: t('pages.insurance.localized.example', '₹3,500–₹7,000 on ₹1 lakh insured'),
      claimWindow: t('pages.insurance.localized.claimWindow', '48–72 hours after localized event'),
      claimSettlement: t('pages.insurance.localized.settlement', '7–15 days post verification'),
      sumInsured: t('pages.insurance.localized.sumInsured', 'Individual farm basis; linked to crop value'),
      govtSubsidy: t('pages.insurance.localized.subsidy', 'Partial; state-dependent'),
      portalLink: 'pmfby.gov.in',
      helpline: t('pages.insurance.localized.helpline', '14447 / State Agriculture Dept.'),
      idealFor: t('pages.insurance.localized.ideal', 'Hilly terrains, Western Ghats, Northeast India, flood-prone plains'),
      pros: [
        t('pages.insurance.localized.pro1', 'Individual farm-level coverage — not area-based'),
        t('pages.insurance.localized.pro2', 'Fast claim on identifiable local events'),
        t('pages.insurance.localized.pro3', 'Can be bundled on top of PMFBY base policy'),
        t('pages.insurance.localized.pro4', 'Covers events not captured by area-yield triggers')
      ],
      caution: t('pages.insurance.localized.caution', 'Only covers the listed local perils. Does not compensate for widespread drought or market price loss.'),
      tag: t('pages.insurance.tags.addon', 'Add-On'),
      tagColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'comprehensive',
      name: t('pages.insurance.comp.name', 'Multi-Risk Policy'),
      fullName: t('pages.insurance.comp.fullName', 'Comprehensive Multi-Risk Crop Insurance (Private/AIC)'),
      coverageType: t('pages.insurance.comp.coverage', 'Flood + Drought + Pest + Fire + Storm + Disease + Post-harvest'),
      premiumKharif: t('pages.insurance.comp.kharif', '6%–10% of Sum Insured'),
      premiumRabi: t('pages.insurance.comp.rabi', '6%–10% of Sum Insured'),
      premiumHorti: t('pages.insurance.comp.horti', '8%–12% of Sum Insured'),
      examplePremium: t('pages.insurance.comp.example', '₹6,000–₹10,000 on ₹1 lakh insured'),
      claimWindow: t('pages.insurance.comp.claimWindow', '7–15 days after incident report'),
      claimSettlement: t('pages.insurance.comp.settlement', '30–60 days with documentation'),
      sumInsured: t('pages.insurance.comp.sumInsured', 'Higher sum insured available — up to full commercial crop value'),
      govtSubsidy: t('pages.insurance.comp.subsidy', 'Minimal / none (private policies)'),
      portalLink: 'aic.co.in / private insurers',
      helpline: t('pages.insurance.comp.helpline', 'Insurer toll-free'),
      idealFor: t('pages.insurance.comp.ideal', 'High-value commercial crops, contract farming, export-oriented farms'),
      pros: [
        t('pages.insurance.comp.pro1', 'Broadest risk coverage — flood, drought, pest, fire, storm combined'),
        t('pages.insurance.comp.pro2', 'Higher insured amount suitable for commercial cultivation'),
        t('pages.insurance.comp.pro3', 'Useful for farms with bank/agri-finance loan collateral'),
        t('pages.insurance.comp.pro4', 'Preferred by corporate agri ventures and FPOs')
      ],
      caution: t('pages.insurance.comp.caution', 'Higher premium with stricter documentation. No government subsidy in most private plans.'),
      tag: t('pages.insurance.tags.commercial', 'Commercial'),
      tagColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'livestock',
      name: t('pages.insurance.livestock.name', 'Livestock Insurance'),
      fullName: t('pages.insurance.livestock.fullName', 'National Livestock Mission Insurance / State Schemes'),
      coverageType: t('pages.insurance.livestock.coverage', 'Death of cattle, buffalo, sheep, goat, pig due to disease or accident'),
      premiumKharif: t('pages.insurance.livestock.kharif', '3%–4.5% of animal market value'),
      premiumRabi: t('pages.insurance.livestock.rabi', '3%–4.5% of animal market value'),
      premiumHorti: 'N/A',
      examplePremium: t('pages.insurance.livestock.example', '₹1,500–₹2,250 on a ₹50,000 animal'),
      claimWindow: t('pages.insurance.livestock.claimWindow', 'Within 24 hours of death'),
      claimSettlement: t('pages.insurance.livestock.settlement', '15–30 days post veterinary certificate'),
      sumInsured: t('pages.insurance.livestock.sumInsured', 'Market value of animal at time of insuring'),
      govtSubsidy: t('pages.insurance.livestock.subsidy', 'Up to 50% premium subsidy for BPL and small farmers'),
      portalLink: 'nlm.udyamimitra.in',
      helpline: t('pages.insurance.livestock.helpline', 'State Animal Husbandry Dept.'),
      idealFor: t('pages.insurance.livestock.ideal', 'Farmers with mixed crop-livestock systems; dairy, poultry farmers'),
      pros: [
        t('pages.insurance.livestock.pro1', 'Covers cattle, buffalo, sheep, goat, pig, poultry'),
        t('pages.insurance.livestock.pro2', '50% subsidy for small/marginal and BPL farmers'),
        t('pages.insurance.livestock.pro3', 'Protects income from dairy/meat during climate disruptions'),
        t('pages.insurance.livestock.pro4', 'Veterinary certificate triggers fast claim')
      ],
      caution: t('pages.insurance.livestock.caution', 'Must tag animals with official ear tag. Claim rejected without vet certificate within 24 hrs of death.'),
      tag: t('pages.insurance.tags.livestock', 'Livestock'),
      tagColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'unified',
      name: 'UPIS',
      fullName: t('pages.insurance.upis.fullName', 'Unified Package Insurance Scheme (Bhartiya Krishi Bima)'),
      coverageType: t('pages.insurance.upis.coverage', 'Crop + Life + Accident + Student scholarship + Asset insurance — bundled'),
      premiumKharif: t('pages.insurance.upis.kharif', 'Bundled: ₹1,999–₹2,500/year (all covers)'),
      premiumRabi: t('pages.insurance.upis.rabi', 'Bundled: ₹1,999–₹2,500/year (all covers)'),
      premiumHorti: t('pages.insurance.upis.horti', 'Bundled: ₹1,999–₹2,500/year (all covers)'),
      examplePremium: t('pages.insurance.upis.example', '₹2,000/year for crop + life + accident + asset bundle'),
      claimWindow: t('pages.insurance.upis.claimWindow', 'As per individual cover rules'),
      claimSettlement: t('pages.insurance.upis.settlement', 'Varies by sub-policy'),
      sumInsured: t('pages.insurance.upis.sumInsured', 'Crop: as per PMFBY; Life: ₹2L; Accident: ₹2L; Asset: up to ₹50K'),
      govtSubsidy: t('pages.insurance.upis.subsidy', 'Heavily subsidised by central govt.'),
      portalLink: 'pmfby.gov.in',
      helpline: '14447',
      idealFor: t('pages.insurance.upis.ideal', 'Farmers wanting holistic financial safety net in a single affordable package'),
      pros: [
        t('pages.insurance.upis.pro1', 'One policy covers crop, life, accident, student scholarship, farm assets'),
        t('pages.insurance.upis.pro2', 'Extremely affordable bundled premium'),
        t('pages.insurance.upis.pro3', 'Farmer household coverage — not just crop'),
        t('pages.insurance.upis.pro4', 'Reduces need to buy multiple separate policies')
      ],
      caution: t('pages.insurance.upis.caution', 'Rolled out in select states/districts. Check local availability before enrolling.'),
      tag: t('pages.insurance.tags.bundle', 'Bundle'),
      tagColor: 'bg-teal-100 text-teal-700'
    }
  ], [t]);

  const regions = useMemo(() => [
    {
      id: 'northwest',
      name: t('pages.insurance.regions.nw.name', 'Northwest India'),
      states: t('pages.insurance.regions.nw.states', 'Punjab · Haryana · Western UP · Rajasthan'),
      color: 'amber',
      emoji: '🌾',
      primaryCrops: t('pages.insurance.regions.nw.crops', 'Wheat, Rice, Mustard, Cotton, Bajra'),
      disasters: ['Drought', 'Hailstorm', 'Heat Wave', 'Pest Attack'],
      topInsurance: ['pmfby', 'rwbcis'],
      note: t('pages.insurance.regions.nw.note', 'Rajasthan faces severe drought; Punjab/Haryana face hail during Rabi. PMFBY covers wheat at 1.5% premium. RWBCIS preferred for horticulture.'),
      riskLevel: 'High',
      avgPremiumPaid: '₹800–₹1,500/ha'
    },
    {
      id: 'northeast',
      name: t('pages.insurance.regions.ne.name', 'Northeast India'),
      states: t('pages.insurance.regions.ne.states', 'Assam · Meghalaya · Manipur · Tripura · Nagaland'),
      color: 'green',
      emoji: '🌿',
      primaryCrops: t('pages.insurance.regions.ne.crops', 'Rice, Tea, Jute, Maize, Vegetables'),
      disasters: ['Flood', 'Landslide', 'Cloudburst', 'Pest Attack'],
      topInsurance: ['pmfby', 'localized'],
      note: t('pages.insurance.regions.ne.note', 'Centre covers 90% premium subsidy for NE states under PMFBY. Frequent floods & landslides make localized peril add-on critical.'),
      riskLevel: 'Very High',
      avgPremiumPaid: '₹200–₹500/ha (90% subsidy)'
    },
    {
      id: 'central',
      name: t('pages.insurance.regions.c.name', 'Central India'),
      states: t('pages.insurance.regions.c.states', 'Madhya Pradesh · Chhattisgarh · Vidarbha (Maharashtra)'),
      color: 'orange',
      emoji: '🫘',
      primaryCrops: t('pages.insurance.regions.c.crops', 'Soybean, Pulses, Wheat, Cotton, Jowar'),
      disasters: ['Drought', 'Hailstorm', 'Pest Attack', 'Flood'],
      topInsurance: ['pmfby', 'rwbcis'],
      note: t('pages.insurance.regions.c.note', 'MP adopted 100% technology-based yield estimation under PMFBY. Vidarbha cotton farmers heavily insured under PMFBY. RWBCIS used for horticulture districts.'),
      riskLevel: 'Very High',
      avgPremiumPaid: '₹1,000–₹2,000/ha'
    },
    {
      id: 'coastal',
      name: t('pages.insurance.regions.ce.name', 'Coastal & Eastern India'),
      states: t('pages.insurance.regions.ce.states', 'Odisha · Andhra Pradesh · Tamil Nadu · West Bengal'),
      color: 'blue',
      emoji: '🌊',
      primaryCrops: t('pages.insurance.regions.ce.crops', 'Rice, Coconut, Banana, Groundnut, Aquaculture'),
      disasters: ['Cyclone', 'Flood', 'Pest Attack', 'Hailstorm'],
      topInsurance: ['pmfby', 'localized', 'comprehensive'],
      note: t('pages.insurance.regions.ce.note', 'Highly cyclone-prone. PMFBY post-harvest cover (14 days after cut & spread) is critical. Odisha offers Re. 1 premium for farmers. Comprehensive policy recommended for coconut/banana plantations.'),
      riskLevel: 'Very High',
      avgPremiumPaid: '₹500–₹1,000/ha (heavily subsidised)'
    },
    {
      id: 'western',
      name: t('pages.insurance.regions.w.name', 'Western India'),
      states: t('pages.insurance.regions.w.states', 'Gujarat · Maharashtra (non-Vidarbha) · Goa'),
      color: 'purple',
      emoji: '🍇',
      primaryCrops: t('pages.insurance.regions.w.crops', 'Cotton, Groundnut, Sugarcane, Grapes, Pomegranate, Onion'),
      disasters: ['Drought', 'Hailstorm', 'Pest Attack', 'Flood'],
      topInsurance: ['rwbcis', 'pmfby', 'comprehensive'],
      note: t('pages.insurance.regions.w.note', 'Maharashtra is a major RWBCIS hub — grapes & pomegranate farmers in Nashik/Solapur extensively use it. Gujarat cotton farmers depend on PMFBY. Horticulture farmers prefer RWBCIS for fast auto-settlement.'),
      riskLevel: 'High',
      avgPremiumPaid: '₹1,500–₹3,000/ha'
    },
    {
      id: 'southern',
      name: t('pages.insurance.regions.s.name', 'Southern Deccan & Hills'),
      states: t('pages.insurance.regions.s.states', 'Karnataka · Kerala · Telangana'),
      color: 'teal',
      emoji: '☕',
      primaryCrops: t('pages.insurance.regions.s.crops', 'Coffee, Tea, Rubber, Ragi, Paddy, Spices'),
      disasters: ['Drought', 'Flood', 'Landslide', 'Pest Attack'],
      topInsurance: ['rwbcis', 'localized', 'comprehensive'],
      note: t('pages.insurance.regions.s.note', 'Kerala & Karnataka hills face landslides. Coffee/spice farms need comprehensive or localized cover. Telangana faces drought cycles. Karnataka 2023 drought caused ₹35,162 cr losses.'),
      riskLevel: 'High',
      avgPremiumPaid: '₹2,000–₹4,000/ha'
    },
    {
      id: 'hilly',
      name: t('pages.insurance.regions.h.name', 'Himalayan & Hilly States'),
      states: t('pages.insurance.regions.h.states', 'Himachal Pradesh · Uttarakhand · J&K · Sikkim'),
      color: 'indigo',
      emoji: '🏔️',
      primaryCrops: t('pages.insurance.regions.h.crops', 'Apple, Cherry, Pea, Potato, Wheat, Herbs'),
      disasters: ['Hailstorm', 'Landslide', 'Cold Wave', 'Cloudburst'],
      topInsurance: ['localized', 'pmfby', 'rwbcis'],
      note: t('pages.insurance.regions.h.note', 'Apple & cherry orchards extremely vulnerable to hail. Localized peril insurance critical. WINDS scheme deploying AWS stations at block level for hyper-local weather data.'),
      riskLevel: 'High',
      avgPremiumPaid: '₹2,000–₹5,000/ha'
    }
  ], [t]);

  const recommendationQuestions = useMemo(() => [
    {
      id: 'region',
      question: t('pages.insurance.q1.question', 'Which region is your farm in?'),
      options: [
        { value: 'northwest', label: t('pages.insurance.q1.nw', 'Northwest (Punjab/Haryana/Rajasthan/W.UP)') },
        { value: 'northeast', label: t('pages.insurance.q1.ne', 'Northeast (Assam/Meghalaya/Manipur etc.)') },
        { value: 'central', label: t('pages.insurance.q1.cen', 'Central (MP/Chhattisgarh/Vidarbha)') },
        { value: 'coastal', label: t('pages.insurance.q1.coa', 'Coastal/East (Odisha/AP/TN/W.Bengal)') },
        { value: 'western', label: t('pages.insurance.q1.west', 'Western (Gujarat/Maharashtra/Goa)') },
        { value: 'southern', label: t('pages.insurance.q1.sou', 'Southern (Karnataka/Kerala/Telangana)') },
        { value: 'hilly', label: t('pages.insurance.q1.hill', 'Hilly (HP/Uttarakhand/J&K/Sikkim)') }
      ]
    },
    {
      id: 'cropType',
      question: t('pages.insurance.q2.question', 'What type of crop do you grow?'),
      options: [
        { value: 'foodgrain', label: t('pages.insurance.q2.food', 'Food grains (Rice, Wheat, Maize, Bajra)') },
        { value: 'oilseed', label: t('pages.insurance.q2.oil', 'Oilseeds (Mustard, Groundnut, Soybean)') },
        { value: 'horticulture', label: t('pages.insurance.q2.hort', 'Horticulture (Fruits, Vegetables, Spices)') },
        { value: 'commercial', label: t('pages.insurance.q2.comm', 'Commercial (Cotton, Sugarcane, Jute)') },
        { value: 'livestock', label: t('pages.insurance.q2.live', 'Livestock / Dairy') }
      ]
    },
    {
      id: 'farmerType',
      question: t('pages.insurance.q3.question', 'What best describes you?'),
      options: [
        { value: 'small', label: t('pages.insurance.q3.small', 'Small / Marginal farmer (< 2 ha)') },
        { value: 'medium', label: t('pages.insurance.q3.med', 'Medium farmer (2–5 ha)') },
        { value: 'large', label: t('pages.insurance.q3.large', 'Large / Commercial farmer (> 5 ha)') },
        { value: 'tenant', label: t('pages.insurance.q3.tenant', 'Tenant / Sharecropper') }
      ]
    }
  ], [t]);

  const getRecommendations = (answers) => {
    const { region, cropType, farmerType } = answers;
    const results = [];

    if (cropType === 'livestock') {
      results.push({ plan: insurancePlans.find(p => p.id === 'livestock'), reason: t('pages.insurance.rec.liveReason1', 'Livestock insurance is the primary option for dairy/cattle farmers.'), priority: 1 });
      results.push({ plan: insurancePlans.find(p => p.id === 'pmfby'), reason: t('pages.insurance.rec.liveReason2', 'If you also grow crops, pair with PMFBY for crop coverage.'), priority: 2 });
      return results;
    }

    if (farmerType === 'small' || farmerType === 'tenant' || cropType === 'foodgrain' || cropType === 'oilseed') {
      results.push({ plan: insurancePlans.find(p => p.id === 'pmfby'), reason: t('pages.insurance.rec.pmfbyReason', 'PMFBY offers low premiums backed by high subsidies. Best fit for your profile.'), priority: 1 });
    }

    if (cropType === 'horticulture' || region === 'western' || region === 'central') {
      results.push({ plan: insurancePlans.find(p => p.id === 'rwbcis'), reason: t('pages.insurance.rec.rwbcisReason', 'RWBCIS is ideal for horticultural crops — auto-settlement via weather stations.'), priority: cropType === 'horticulture' ? 1 : 2 });
    }

    if (region === 'northeast' || region === 'hilly' || region === 'coastal') {
      results.push({ plan: insurancePlans.find(p => p.id === 'localized'), reason: t('pages.insurance.rec.localReason', 'Frequent local perils exist in your region. Localized peril add-on gives individual farm-level coverage.'), priority: 2 });
    }

    if (farmerType === 'large' || cropType === 'commercial') {
      results.push({ plan: insurancePlans.find(p => p.id === 'comprehensive'), reason: t('pages.insurance.rec.compReason', 'Large/commercial farms benefit from comprehensive multi-risk policies.'), priority: 2 });
    }

    if (farmerType === 'small' || farmerType === 'tenant') {
      results.push({ plan: insurancePlans.find(p => p.id === 'unified'), reason: t('pages.insurance.rec.upisReason', 'UPIS bundles crop, life, and accident cover in one affordable package.'), priority: 3 });
    }

    const seen = new Set();
    return results.filter(r => {
      if (seen.has(r.plan.id)) return false;
      seen.add(r.plan.id);
      return true;
    }).sort((a, b) => a.priority - b.priority);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowResults(false);
  };

  const allAnswered = recommendationQuestions.every(q => answers[q.id]);
  const recommendations = showResults ? getRecommendations(answers) : [];
  const getPlanById = (id) => insurancePlans.find(p => p.id === id);

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">{t('pages.insurance.heroCategory', 'Financial Protection')}</p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">{t('pages.insurance.heroTitle', 'Crop Insurance Suggestions & Comparison')}</h1>
            <p className="mt-3 text-sm text-emerald-50 md:text-base">
              {t('pages.insurance.heroSubtitle', 'Compare all government and private insurance options with actual premium rates, region-specific disaster data, and a personalized recommendation engine — all based on official Indian government data.')}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <div className="space-y-1 text-sm font-medium">
                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faShieldAlt} /><span>{t('pages.insurance.stat1', '6 insurance schemes')}</span></div>
                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faMapMarkerAlt} /><span>{t('pages.insurance.stat2', '7 regional risks')}</span></div>
                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faStar} /><span>{t('pages.insurance.stat3', 'Personalized advisor')}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: t('pages.insurance.metric1Value', '₹1.83 Lakh Cr'), sub: t('pages.insurance.metric1Label', 'Claims paid since 2016') },
            { label: t('pages.insurance.metric2Value', '4+ Crore'), sub: t('pages.insurance.metric2Label', 'Farmers enrolled FY24') },
            { label: t('pages.insurance.metric3Value', '₹69,515 Cr'), sub: t('pages.insurance.metric3Label', 'Govt outlay FY22-26') },
            { label: t('pages.insurance.metric4Value', '70+ Crops'), sub: t('pages.insurance.metric4Label', 'Notified crops') }
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-center backdrop-blur-sm">
              <p className="text-base font-bold">{stat.label}</p>
              <p className="text-xs text-emerald-100">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {[
          { id: 'plans', label: t('pages.insurance.tabs.plans', 'Insurance Plans') },
          { id: 'regions', label: t('pages.insurance.tabs.regions', 'Regional Risk Map') },
          { id: 'compare', label: t('pages.insurance.tabs.compare', 'Premium Comparison') },
          { id: 'recommend', label: t('pages.insurance.tabs.recommend', '🎯 Get Recommendation') }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'plans' && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {insurancePlans.map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                      <FontAwesomeIcon icon={faSeedling} />
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">{plan.name}</p>
                      <h2 className="text-sm font-semibold text-slate-900 leading-tight">{plan.fullName}</h2>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${plan.tagColor}`}>{plan.tag}</span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">{t('pages.insurance.lblCoverage', 'Coverage')}:</span> {plan.coverageType}</p>
                  <div className="rounded-lg bg-emerald-50 p-2.5 space-y-1">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{t('pages.insurance.lblPremium', 'Farmer Premium (after subsidy)')}</p>
                    <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-600 text-xs" /><span><span className="font-medium text-slate-800">{t('pages.insurance.lblKharif', 'Kharif')}:</span> {plan.premiumKharif}</span></p>
                    <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-600 text-xs" /><span><span className="font-medium text-slate-800">{t('pages.insurance.lblRabi', 'Rabi')}:</span> {plan.premiumRabi}</span></p>
                    <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faLeaf} className="text-emerald-600 text-xs" /><span><span className="font-medium text-slate-800">{t('pages.insurance.lblHorti', 'Horticulture')}:</span> {plan.premiumHorti}</span></p>
                    <p className="text-xs text-slate-500 italic">e.g. {plan.examplePremium}</p>
                  </div>
                  <p className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCalendarCheck} className="mt-0.5 text-emerald-600 shrink-0" />
                    <span><span className="font-medium text-slate-800">{t('pages.insurance.lblReport', 'Report within')}:</span> {plan.claimWindow}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="mt-0.5 text-emerald-600 shrink-0" />
                    <span><span className="font-medium text-slate-800">{t('pages.insurance.lblSettle', 'Settlement')}:</span> {plan.claimSettlement}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCloudRain} className="mt-0.5 text-emerald-600 shrink-0" />
                    <span><span className="font-medium text-slate-800">{t('pages.insurance.lblBest', 'Best for')}:</span> {plan.idealFor}</span>
                  </p>
                  {plan.govtSubsidy && (
                    <p className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faShieldAlt} className="mt-0.5 text-emerald-600 shrink-0" />
                      <span><span className="font-medium text-slate-800">{t('pages.insurance.lblGovtSubsidy', 'Govt. Subsidy')}:</span> {plan.govtSubsidy}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800"
                >
                  <FontAwesomeIcon icon={expandedPlan === plan.id ? faChevronUp : faChevronDown} />
                  {expandedPlan === plan.id ? t('pages.insurance.btnShowLess', 'Show less') : t('pages.insurance.btnShowMore', 'Show benefits & caution')}
                </button>

                {expandedPlan === plan.id && (
                  <div className="mt-3 space-y-3">
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {plan.pros.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5 text-emerald-600 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
                      {plan.caution}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 px-5 py-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {plan.helpline && (
                  <span className="flex items-center gap-1"><FontAwesomeIcon icon={faPhone} className="text-emerald-500" /> {plan.helpline}</span>
                )}
                {plan.portalLink && (
                  <span className="flex items-center gap-1"><FontAwesomeIcon icon={faGlobe} className="text-emerald-500" /> {plan.portalLink}</span>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'regions' && (
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
            <h3 className="font-semibold text-slate-900">{t('pages.insurance.regionsTitle', 'Region-wise Risk & Insurance Mapping')}</h3>
            <p className="text-sm text-slate-500 mt-1">{t('pages.insurance.regionsSubtitle', 'Based on NDMA disaster data, PMFBY enrollment patterns, and IMD climate hazard atlas. Select a region card to explore recommended plans.')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {regions.map(region => {
              const colors = colorMap[region.color];
              return (
                <article key={region.id} className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 shadow-sm`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{region.emoji}</span>
                      <div>
                        <h2 className="font-semibold text-slate-900">{region.name}</h2>
                        <p className="text-xs text-slate-500">{region.states}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${riskColors[region.riskLevel]}`}>
                      {t(`pages.insurance.risk.${region.riskLevel.replace(' ', '')}`, region.riskLevel)} {t('pages.insurance.lblRisk', 'Risk')}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 mb-3">
                    <span className="font-medium text-slate-900">{t('pages.insurance.lblKeyCrops', 'Key Crops')}: </span>{region.primaryCrops}
                  </p>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{t('pages.insurance.lblFreqDisasters', 'Frequent Disasters')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {region.disasters.map(d => (
                        <span key={d} className="flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-700">
                          <FontAwesomeIcon icon={disasterIcons[d] || faTriangleExclamation} className="text-red-400" />
                          {t(`pages.insurance.disasters.${d.replace(/ /g, '')}`, d)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{t('pages.insurance.lblRecInsurance', 'Recommended Insurance')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {region.topInsurance.map((id, i) => {
                        const plan = getPlanById(id);
                        return plan ? (
                          <span key={id} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-300 text-emerald-700'}`}>
                            {i === 0 ? '★ ' : ''}{plan.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/70 border border-slate-200 p-2.5 text-xs text-slate-600">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-slate-400" />
                    {region.note}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">{t('pages.insurance.lblAvgPremium', 'Avg. farmer premium')}:</span> {region.avgPremiumPaid}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'compare' && (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{t('pages.insurance.compareTitle', 'Premium & Coverage Comparison')}</h3>
              <p className="text-sm text-slate-500">{t('pages.insurance.compareSubtitle', 'Actual farmer-payable premium rates as per Government of India notification (2024–25). Government subsidises 95–98% of actuarial premium under PMFBY/RWBCIS.')}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblScheme', 'Insurance Scheme')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblKharif', 'Kharif Premium')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblRabi', 'Rabi Premium')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblHorti', 'Horticulture')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblSum', 'Sum Insured')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblSpeed', 'Claim Speed')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblGovtSubsidy', 'Govt. Subsidy')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {insurancePlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{plan.name}</p>
                        <p className="text-xs text-slate-400">{plan.fullName.split('(')[0].trim()}</p>
                      </td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{plan.premiumKharif}</td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{plan.premiumRabi}</td>
                      <td className="px-4 py-3 text-emerald-700 font-medium">{plan.premiumHorti}</td>
                      <td className="px-4 py-3 text-xs">{plan.sumInsured}</td>
                      <td className="px-4 py-3 text-xs">{plan.claimSettlement}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          plan.govtSubsidy.includes('95') || plan.govtSubsidy.includes('50') || plan.govtSubsidy.includes('90') || plan.govtSubsidy.includes(t('pages.insurance.num95', '95'))
                            ? 'bg-emerald-100 text-emerald-700'
                            : plan.govtSubsidy.includes('Partial') || plan.govtSubsidy.includes(t('pages.insurance.partial', 'Partial'))
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {plan.govtSubsidy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{t('pages.insurance.cropPremiumTitle', 'Crop-wise Premium Examples (PMFBY 2024–25)')}</h3>
              <p className="text-sm text-slate-500">{t('pages.insurance.cropPremiumSubtitle', 'Indicative farmer-payable premium on ₹50,000 sum insured per hectare. Actual values notified by state governments.')}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblCropStr', 'Crop')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblSeason', 'Season')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblMaxPct', 'Max Farmer Premium %')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblAmt50k', 'Premium on ₹50,000 SI')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('pages.insurance.tblPlanScheme', 'Scheme')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { crop: t('pages.insurance.crops.rice', 'Rice (Paddy)'), season: t('pages.insurance.seasons.kharif', 'Kharif'), pct: '2%', amount: '₹1,000', scheme: 'PMFBY' },
                    { crop: t('pages.insurance.crops.wheat', 'Wheat'), season: t('pages.insurance.seasons.rabi', 'Rabi'), pct: '1.5%', amount: '₹750', scheme: 'PMFBY' },
                    { crop: t('pages.insurance.crops.maize', 'Maize'), season: t('pages.insurance.seasons.kharif', 'Kharif'), pct: '2%', amount: '₹1,000', scheme: 'PMFBY' },
                    { crop: t('pages.insurance.crops.mustard', 'Mustard'), season: t('pages.insurance.seasons.rabi', 'Rabi'), pct: '1.5%', amount: '₹750', scheme: 'PMFBY' },
                    { crop: t('pages.insurance.crops.soybean', 'Soybean'), season: t('pages.insurance.seasons.kharif', 'Kharif'), pct: '2%', amount: '₹1,000', scheme: 'PMFBY' },
                    { crop: t('pages.insurance.crops.cotton', 'Cotton'), season: t('pages.insurance.seasons.kharif', 'Kharif'), pct: '5%', amount: '₹2,500', scheme: 'PMFBY' },
                    { crop: t('pages.insurance.crops.sugarcane', 'Sugarcane'), season: t('pages.insurance.seasons.annual', 'Annual'), pct: '5%', amount: '₹2,500', scheme: 'PMFBY' },
                    { crop: t('pages.insurance.crops.grapes', 'Grapes / Pomegranate'), season: t('pages.insurance.seasons.annual', 'Annual'), pct: '5%', amount: '₹2,500', scheme: 'RWBCIS' },
                    { crop: t('pages.insurance.crops.tomato', 'Tomato / Onion'), season: t('pages.insurance.seasons.both', 'Both'), pct: '5%', amount: '₹2,500', scheme: 'RWBCIS' },
                    { crop: t('pages.insurance.crops.banana', 'Banana'), season: t('pages.insurance.seasons.annual', 'Annual'), pct: '5%', amount: '₹2,500', scheme: 'RWBCIS' }
                  ].map((row) => (
                    <tr key={row.crop} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{row.crop}</td>
                      <td className="px-4 py-3">{row.season}</td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">{row.pct}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.scheme === 'PMFBY' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
                          {row.scheme}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
              {t('pages.insurance.sourceNote', 'Source: PIB Press Release, PMFBY Operational Guidelines, GoI (2024–25). Actual premium varies by state notification.')}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'recommend' && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700 text-xl">
                <FontAwesomeIcon icon={faComments} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t('pages.insurance.advisorTitle', 'Personalized Insurance Advisor')}</h3>
                <p className="text-sm text-slate-500">{t('pages.insurance.advisorSubtitle', 'Answer 3 questions to get the best-matched insurance plan for your farm.')}</p>
              </div>
            </div>

            <div className="space-y-5">
              {recommendationQuestions.map((q, qi) => (
                <div key={q.id}>
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs mr-2">{qi + 1}</span>
                    {q.question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                          answers[q.id] === opt.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowResults(true)}
              disabled={!allAnswered}
              className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition ${
                allAnswered
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {allAnswered ? t('pages.insurance.btnGetRec', '🎯 Get My Insurance Recommendation') : t('pages.insurance.btnAnswerAll', 'Answer all questions above to continue')}
            </button>
          </div>

          {showResults && recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <h3 className="font-semibold text-emerald-800">{t('pages.insurance.recTitle', 'Your Recommended Plans')}</h3>
                <p className="text-sm text-emerald-600 mt-0.5">{t('pages.insurance.recSubtitle', 'Based on your farm profile, here are the best-matched insurance options, ranked by priority.')}</p>
              </div>

              {recommendations.map((rec, i) => (
                <article key={rec.plan.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${i === 0 ? 'bg-emerald-600' : 'bg-slate-400'}`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900">{rec.plan.fullName}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${rec.plan.tagColor}`}>{rec.plan.tag}</span>
                        {i === 0 && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">{t('pages.insurance.bestMatch', 'Best Match')}</span>}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{rec.reason}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">{t('pages.insurance.lblKharifPrm', 'Kharif Premium')}</p>
                      <p className="font-semibold text-emerald-700">{rec.plan.premiumKharif}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">{t('pages.insurance.lblRabiPrm', 'Rabi Premium')}</p>
                      <p className="font-semibold text-emerald-700">{rec.plan.premiumRabi}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">{t('pages.insurance.lblClaimRepBy', 'Claim Report By')}</p>
                      <p className="font-semibold text-slate-800">{rec.plan.claimWindow}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-slate-500">{t('pages.insurance.lblHelpline', 'Helpline')}</p>
                      <p className="font-semibold text-slate-800">{rec.plan.helpline}</p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-3">{t('pages.insurance.howToApply', 'How to Apply & Contact')}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: faGlobe, label: t('pages.insurance.apply.onlineLbl', 'Online Portal'), value: 'pmfby.gov.in', sub: t('pages.insurance.apply.onlineSub', 'Apply online, check status, download policy') },
                    { icon: faMobileAlt, label: t('pages.insurance.apply.appLbl', 'Mobile App'), value: t('pages.insurance.apply.appVal', 'Crop Insurance App'), sub: t('pages.insurance.apply.appSub', 'Available on Google Play Store') },
                    { icon: faPhone, label: t('pages.insurance.apply.krLbl', 'Kisan Rakshak Helpline'), value: '14447', sub: t('pages.insurance.apply.krSub', '24/7 toll-free; also on WhatsApp: 7065514447') },
                    { icon: faPhone, label: t('pages.insurance.apply.kccLbl', 'Kisan Call Centre'), value: '1800-180-1551', sub: t('pages.insurance.apply.kccSub', 'All-India free helpline for farm queries') },
                    { icon: faMapMarkerAlt, label: t('pages.insurance.apply.cscLbl', 'Nearest CSC'), value: t('pages.insurance.apply.cscVal', 'Common Service Centre'), sub: t('pages.insurance.apply.cscSub', 'Visit CSC for offline enrollment & assistance') },
                    { icon: faMoneyBillWave, label: t('pages.insurance.apply.bankLbl', 'Bank / PACS'), value: t('pages.insurance.apply.bankVal', 'Your nearest Bank Branch'), sub: t('pages.insurance.apply.bankSub', 'KCC holders auto-enrolled; non-loanee can walk in') }
                  ].map(ch => (
                    <div key={ch.label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700 shrink-0">
                        <FontAwesomeIcon icon={ch.icon} />
                      </span>
                      <div>
                        <p className="text-xs text-slate-500">{ch.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{ch.value}</p>
                        <p className="text-xs text-slate-500">{ch.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-slate-400 pb-2">
                {t('pages.insurance.apply.footerSrc', 'Data source: pmfby.gov.in · PIB Press Release (Jan 2025) · NDMA · IMD Climate Hazard Atlas')}
              </p>
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default CropInsuranceSuggestions;