// ─── SHARED INSURANCE DATA MODULE ─────────────────────────────────────────────
// Extracted from CropInsuranceSuggestions.jsx for reuse across AI Agent + Insurance page

export const getInsurancePlans = () => [
  {
    id: 'pmfby',
    name: 'PMFBY',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    coverageType: 'Yield + Prevented Sowing + Post-harvest + Mid-season adversity',
    premiumKharif: '2% of Sum Insured (max)',
    premiumRabi: '1.5% of Sum Insured (max)',
    premiumHorti: '5% of Sum Insured (max)',
    premiumKharifPct: 2,
    premiumRabiPct: 1.5,
    premiumHortiPct: 5,
    examplePremium: '₹1,000 on ₹50,000 insured (Kharif)',
    claimWindow: 'Within 72 hours of damage event',
    claimSettlement: 'Within 2 months of harvest',
    sumInsured: 'Equal to Scale of Finance per hectare (avg. ₹40,700/ha)',
    sumInsuredPerHa: 40700,
    govtSubsidy: '95–98% of actual premium',
    portalLink: 'pmfby.gov.in',
    helpline: '14447',
    idealFor: 'Small & marginal farmers growing food, oilseed, or horticultural crops',
    pros: [
      'Lowest farmer premium in India (as low as ₹1 in some states like Maharashtra)',
      'Covers pre-sowing to post-harvest losses',
      'Government-funded: ₹69,515 crore allocated for FY22–26',
      'Voluntary since 2020; KCC farmers auto-enrolled',
      'YES-TECH satellite-based claim verification since Kharif 2023'
    ],
    caution: 'Claim confirmation requires state-level survey. 72-hour reporting is mandatory — missing it can mean rejection.',
    tag: 'Most Popular',
    tagColor: 'bg-emerald-100 text-emerald-700',
    termsAndConditions: [
      'Farmer must report crop damage within 72 hours of the event via the Crop Insurance App, CSC, or helpline 14447.',
      'The insurance is valid for notified crops in notified areas only, as per state government notification.',
      'KCC (Kisan Credit Card) holders are auto-enrolled unless they opt out in writing before the cut-off date.',
      'Premium rates are capped: Kharif 2%, Rabi 1.5%, Horticulture 5% of Sum Insured. Balance premium is paid by Central & State Government.',
      'Claim settlement is based on area-approach yield data collected via Crop Cutting Experiments (CCE).',
      'Post-harvest losses are covered for up to 14 days after harvesting for crops left in "cut & spread" condition in the field.',
      'Mid-season adversity relief (25% of likely claim) is available if crop loss exceeds 50% due to adverse weather.',
      'Policy is valid for one crop season only. Renewal must be done each season.',
      'Farmer must have insurable interest — must be cultivating the notified crop in the notified area.',
      'All disputes shall be subject to the jurisdiction of the courts of the respective district.'
    ]
  },
  {
    id: 'rwbcis',
    name: 'RWBCIS',
    fullName: 'Restructured Weather Based Crop Insurance Scheme',
    coverageType: 'Rainfall deficit/excess · Temperature extremes · Humidity · Wind speed',
    premiumKharif: '2% of Sum Insured (food & oilseeds)',
    premiumRabi: '1.5% of Sum Insured (food & oilseeds)',
    premiumHorti: '5% of Sum Insured (commercial/horticulture)',
    premiumKharifPct: 2,
    premiumRabiPct: 1.5,
    premiumHortiPct: 5,
    examplePremium: '₹1,500 on ₹75,000 insured (horticulture Kharif)',
    claimWindow: 'Auto-triggered — no intimation required',
    claimSettlement: '45 days after trigger event',
    sumInsured: 'Based on state govt. payout structure per crop/district',
    sumInsuredPerHa: 50000,
    govtSubsidy: 'Centre + State share remaining after farmer premium',
    portalLink: 'pmfby.gov.in',
    helpline: '14447',
    idealFor: 'Rain-fed areas; horticulture farmers growing grapes, pomegranate, tomato, banana',
    pros: [
      'No field inspection needed — weather station data auto-settles',
      'Covers rainfall deficit, excess rain, high/low temperatures, humidity',
      'Add-on for hailstorm & cloudburst available',
      'Implemented across Maharashtra, Rajasthan, MP, Karnataka, AP and more',
      'Ideal for horticultural crops where PMFBY coverage is limited'
    ],
    caution: 'Payout linked to weather station readings, not actual field loss (basis risk). Choose only if weather station is within 10–15 km.',
    tag: 'Weather-Based',
    tagColor: 'bg-sky-100 text-sky-700',
    termsAndConditions: [
      'Claims are auto-triggered based on weather data from the Reference Weather Station (RWS) assigned to your area.',
      'No need for individual claim intimation — payouts are automatic when weather triggers are breached.',
      'The weather parameters monitored include: rainfall, temperature, relative humidity, and wind speed.',
      'Premium rates are identical to PMFBY: Kharif 2%, Rabi 1.5%, Horticulture 5% of Sum Insured.',
      'Basis risk exists: if actual farm loss differs from weather station readings, the payout may not match actual damage.',
      'Coverage period is linked to crop-specific weather windows notified by state government.',
      'Add-on covers for hailstorm and cloudburst may be available at additional premium in select states.',
      'Farmer must ensure the nearest weather station is within 10–15 km for meaningful coverage.',
      'Policy is valid for one crop season only.',
      'All disputes are subject to arbitration as per the scheme guidelines.'
    ]
  },
  {
    id: 'localized',
    name: 'Localized Peril',
    fullName: 'Localized Peril Insurance (Add-on under PMFBY)',
    coverageType: 'Hailstorm · Landslide · Inundation · Cloudburst · Flash floods',
    premiumKharif: '3%–7% of Sum Insured',
    premiumRabi: '3%–7% of Sum Insured',
    premiumHorti: '5%–8% of Sum Insured',
    premiumKharifPct: 5,
    premiumRabiPct: 5,
    premiumHortiPct: 6.5,
    examplePremium: '₹3,500–₹7,000 on ₹1 lakh insured',
    claimWindow: '48–72 hours after localized event',
    claimSettlement: '7–15 days post verification',
    sumInsured: 'Individual farm basis; linked to crop value',
    sumInsuredPerHa: 60000,
    govtSubsidy: 'Partial; state-dependent',
    portalLink: 'pmfby.gov.in',
    helpline: '14447 / State Agriculture Dept.',
    idealFor: 'Hilly terrains, Western Ghats, Northeast India, flood-prone plains',
    pros: [
      'Individual farm-level coverage — not area-based',
      'Fast claim on identifiable local events',
      'Can be bundled on top of PMFBY base policy',
      'Covers events not captured by area-yield triggers'
    ],
    caution: 'Only covers the listed local perils. Does not compensate for widespread drought or market price loss.',
    tag: 'Add-On',
    tagColor: 'bg-purple-100 text-purple-700',
    termsAndConditions: [
      'This is an add-on cover available under PMFBY for localized calamities occurring on individual farms.',
      'Covered perils: Hailstorm, Landslide, Waterlogging/Inundation, Cloudburst, and Flash Floods only.',
      'Damage must be reported within 48–72 hours of the localized event via Crop Insurance App or helpline.',
      'Individual farm-level assessment is conducted — unlike area-based PMFBY claims.',
      'Premium is higher than base PMFBY (3%–8% of Sum Insured depending on crop and region).',
      'Government subsidy varies by state — may cover partial premium.',
      'Does NOT cover drought, widespread floods, market price loss, or pest attacks.',
      'Verification is done through drone/satellite imagery or field officer visits.',
      'This cover can be purchased alongside the base PMFBY policy.',
      'Policy period aligns with the base PMFBY crop season.'
    ]
  },
  {
    id: 'comprehensive',
    name: 'Multi-Risk Policy',
    fullName: 'Comprehensive Multi-Risk Crop Insurance (Private/AIC)',
    coverageType: 'Flood + Drought + Pest + Fire + Storm + Disease + Post-harvest',
    premiumKharif: '6%–10% of Sum Insured',
    premiumRabi: '6%–10% of Sum Insured',
    premiumHorti: '8%–12% of Sum Insured',
    premiumKharifPct: 8,
    premiumRabiPct: 8,
    premiumHortiPct: 10,
    examplePremium: '₹6,000–₹10,000 on ₹1 lakh insured',
    claimWindow: '7–15 days after incident report',
    claimSettlement: '30–60 days with documentation',
    sumInsured: 'Higher sum insured available — up to full commercial crop value',
    sumInsuredPerHa: 100000,
    govtSubsidy: 'Minimal / none (private policies)',
    portalLink: 'aic.co.in / private insurers',
    helpline: 'Insurer toll-free',
    idealFor: 'High-value commercial crops, contract farming, export-oriented farms',
    pros: [
      'Broadest risk coverage — flood, drought, pest, fire, storm combined',
      'Higher insured amount suitable for commercial cultivation',
      'Useful for farms with bank/agri-finance loan collateral',
      'Preferred by corporate agri ventures and FPOs'
    ],
    caution: 'Higher premium with stricter documentation. No government subsidy in most private plans.',
    tag: 'Commercial',
    tagColor: 'bg-amber-100 text-amber-700',
    termsAndConditions: [
      'This is a private/AIC comprehensive policy covering multiple risks simultaneously.',
      'Covered perils include: Flood, Drought, Pest Attack, Fire, Storm, Disease, and Post-harvest losses.',
      'Premium rates are higher: 6%–12% of Sum Insured with no/minimal government subsidy.',
      'Higher sum insured is available — up to full commercial crop value as assessed by the insurer.',
      'Claim must be reported within 7–15 days of the incident with supporting documentation.',
      'Required documents: FIR (for fire/theft), crop damage photos, revenue records, bank statements.',
      'Settlement timeline is 30–60 days after documentation is complete and verified.',
      'Suitable for large-scale commercial farming, contract farming, and export-oriented agriculture.',
      'Insurer reserves the right to conduct field inspection before claim approval.',
      'Policy terms vary by insurer. Read the policy document carefully before purchasing.'
    ]
  },
  {
    id: 'livestock',
    name: 'Livestock Insurance',
    fullName: 'National Livestock Mission Insurance / State Schemes',
    coverageType: 'Death of cattle, buffalo, sheep, goat, pig due to disease or accident',
    premiumKharif: '3%–4.5% of animal market value',
    premiumRabi: '3%–4.5% of animal market value',
    premiumHorti: 'N/A',
    premiumKharifPct: 3.75,
    premiumRabiPct: 3.75,
    premiumHortiPct: 0,
    examplePremium: '₹1,500–₹2,250 on a ₹50,000 animal',
    claimWindow: 'Within 24 hours of death',
    claimSettlement: '15–30 days post veterinary certificate',
    sumInsured: 'Market value of animal at time of insuring',
    sumInsuredPerHa: 50000,
    govtSubsidy: 'Up to 50% premium subsidy for BPL and small farmers',
    portalLink: 'nlm.udyamimitra.in',
    helpline: 'State Animal Husbandry Dept.',
    idealFor: 'Farmers with mixed crop-livestock systems; dairy, poultry farmers',
    pros: [
      'Covers cattle, buffalo, sheep, goat, pig, poultry',
      '50% subsidy for small/marginal and BPL farmers',
      'Protects income from dairy/meat during climate disruptions',
      'Veterinary certificate triggers fast claim'
    ],
    caution: 'Must tag animals with official ear tag. Claim rejected without vet certificate within 24 hrs of death.',
    tag: 'Livestock',
    tagColor: 'bg-orange-100 text-orange-700',
    termsAndConditions: [
      'Animals must be tagged with an official ear tag issued by the Animal Husbandry Department at the time of insuring.',
      'Death of the insured animal must be reported within 24 hours to the insurer and nearest veterinary hospital.',
      'A post-mortem/veterinary certificate is MANDATORY for claim processing — rejection if not produced.',
      'Premium: 3%–4.5% of the animal\'s assessed market value. 50% subsidy for BPL/small/marginal farmers.',
      'Covered causes: Disease, accident, natural calamity, surgical operations. NOT covered: willful slaughter, neglect.',
      'Policy period is typically 1–3 years depending on the animal and scheme.',
      'Claim amount equals the insured value minus salvage (if any).',
      'Farmer must provide proof of ownership (purchase receipt, panchayat certificate, or Aadhaar-linked records).',
      'Insurance can be availed through nearest veterinary hospital, bank, or Common Service Centre.',
      'Livestock must undergo health check before policy issuance.'
    ]
  },
  {
    id: 'unified',
    name: 'UPIS',
    fullName: 'Unified Package Insurance Scheme (Bhartiya Krishi Bima)',
    coverageType: 'Crop + Life + Accident + Student scholarship + Asset insurance — bundled',
    premiumKharif: 'Bundled: ₹1,999–₹2,500/year (all covers)',
    premiumRabi: 'Bundled: ₹1,999–₹2,500/year (all covers)',
    premiumHorti: 'Bundled: ₹1,999–₹2,500/year (all covers)',
    premiumKharifPct: 0,
    premiumRabiPct: 0,
    premiumHortiPct: 0,
    fixedPremium: 2250,
    examplePremium: '₹2,000/year for crop + life + accident + asset bundle',
    claimWindow: 'As per individual cover rules',
    claimSettlement: 'Varies by sub-policy',
    sumInsured: 'Crop: as per PMFBY; Life: ₹2L; Accident: ₹2L; Asset: up to ₹50K',
    sumInsuredPerHa: 40700,
    govtSubsidy: 'Heavily subsidised by central govt.',
    portalLink: 'pmfby.gov.in',
    helpline: '14447',
    idealFor: 'Farmers wanting holistic financial safety net in a single affordable package',
    pros: [
      'One policy covers crop, life, accident, student scholarship, farm assets',
      'Extremely affordable bundled premium',
      'Farmer household coverage — not just crop',
      'Reduces need to buy multiple separate policies'
    ],
    caution: 'Rolled out in select states/districts. Check local availability before enrolling.',
    tag: 'Bundle',
    tagColor: 'bg-teal-100 text-teal-700',
    termsAndConditions: [
      'UPIS is a bundled package covering: crop insurance, life insurance, personal accident, student scholarship, and farm assets.',
      'Annual premium is approximately ₹1,999–₹2,500 for the complete package — heavily subsidised by central government.',
      'Crop insurance component follows PMFBY rules (area-approach, CCE-based claim settlement).',
      'Life cover: ₹2,00,000 in case of natural death of the insured farmer.',
      'Accident cover: ₹2,00,000 in case of accidental death or permanent disability.',
      'Student scholarship: Children of insured farmers may receive scholarship benefits as per scheme rules.',
      'Farm asset cover: Up to ₹50,000 for damage to farm dwelling, equipment, or stored produce.',
      'Availability is limited to select states/districts. Check with nearest CSC, bank, or agriculture office.',
      'Enrollment is typically done at the beginning of the crop season through the PMFBY portal or offline at CSC/bank.',
      'All sub-policies have individual terms. Read the combined policy document carefully.'
    ]
  }
];

export const getRegions = () => [
  {
    id: 'northwest',
    name: 'Northwest India',
    states: 'Punjab · Haryana · Western UP · Rajasthan',
    primaryCrops: 'Wheat, Rice, Mustard, Cotton, Bajra',
    disasters: ['Drought', 'Hailstorm', 'Heat Wave', 'Pest Attack'],
    topInsurance: ['pmfby', 'rwbcis'],
    riskLevel: 'High',
    avgPremiumPaid: '₹800–₹1,500/ha'
  },
  {
    id: 'northeast',
    name: 'Northeast India',
    states: 'Assam · Meghalaya · Manipur · Tripura · Nagaland',
    primaryCrops: 'Rice, Tea, Jute, Maize, Vegetables',
    disasters: ['Flood', 'Landslide', 'Cloudburst', 'Pest Attack'],
    topInsurance: ['pmfby', 'localized'],
    riskLevel: 'Very High',
    avgPremiumPaid: '₹200–₹500/ha (90% subsidy)'
  },
  {
    id: 'central',
    name: 'Central India',
    states: 'Madhya Pradesh · Chhattisgarh · Vidarbha (Maharashtra)',
    primaryCrops: 'Soybean, Pulses, Wheat, Cotton, Jowar',
    disasters: ['Drought', 'Hailstorm', 'Pest Attack', 'Flood'],
    topInsurance: ['pmfby', 'rwbcis'],
    riskLevel: 'Very High',
    avgPremiumPaid: '₹1,000–₹2,000/ha'
  },
  {
    id: 'coastal',
    name: 'Coastal & Eastern India',
    states: 'Odisha · Andhra Pradesh · Tamil Nadu · West Bengal',
    primaryCrops: 'Rice, Coconut, Banana, Groundnut, Aquaculture',
    disasters: ['Cyclone', 'Flood', 'Pest Attack', 'Hailstorm'],
    topInsurance: ['pmfby', 'localized', 'comprehensive'],
    riskLevel: 'Very High',
    avgPremiumPaid: '₹500–₹1,000/ha (heavily subsidised)'
  },
  {
    id: 'western',
    name: 'Western India',
    states: 'Gujarat · Maharashtra (non-Vidarbha) · Goa',
    primaryCrops: 'Cotton, Groundnut, Sugarcane, Grapes, Pomegranate, Onion',
    disasters: ['Drought', 'Hailstorm', 'Pest Attack', 'Flood'],
    topInsurance: ['rwbcis', 'pmfby', 'comprehensive'],
    riskLevel: 'High',
    avgPremiumPaid: '₹1,500–₹3,000/ha'
  },
  {
    id: 'southern',
    name: 'Southern Deccan & Hills',
    states: 'Karnataka · Kerala · Telangana',
    primaryCrops: 'Coffee, Tea, Rubber, Ragi, Paddy, Spices',
    disasters: ['Drought', 'Flood', 'Landslide', 'Pest Attack'],
    topInsurance: ['rwbcis', 'localized', 'comprehensive'],
    riskLevel: 'High',
    avgPremiumPaid: '₹2,000–₹4,000/ha'
  },
  {
    id: 'hilly',
    name: 'Himalayan & Hilly States',
    states: 'Himachal Pradesh · Uttarakhand · J&K · Sikkim',
    primaryCrops: 'Apple, Cherry, Pea, Potato, Wheat, Herbs',
    disasters: ['Hailstorm', 'Landslide', 'Cold Wave', 'Cloudburst'],
    topInsurance: ['localized', 'pmfby', 'rwbcis'],
    riskLevel: 'High',
    avgPremiumPaid: '₹2,000–₹5,000/ha'
  }
];

export const getRecommendationQuestions = () => [
  {
    id: 'region',
    question: 'Which region is your farm in?',
    options: [
      { value: 'northwest', label: 'Northwest (Punjab/Haryana/Rajasthan/W.UP)' },
      { value: 'northeast', label: 'Northeast (Assam/Meghalaya/Manipur etc.)' },
      { value: 'central', label: 'Central (MP/Chhattisgarh/Vidarbha)' },
      { value: 'coastal', label: 'Coastal/East (Odisha/AP/TN/W.Bengal)' },
      { value: 'western', label: 'Western (Gujarat/Maharashtra/Goa)' },
      { value: 'southern', label: 'Southern (Karnataka/Kerala/Telangana)' },
      { value: 'hilly', label: 'Hilly (HP/Uttarakhand/J&K/Sikkim)' }
    ]
  },
  {
    id: 'cropType',
    question: 'What type of crop do you grow?',
    options: [
      { value: 'foodgrain', label: 'Food grains (Rice, Wheat, Maize, Bajra)' },
      { value: 'oilseed', label: 'Oilseeds (Mustard, Groundnut, Soybean)' },
      { value: 'horticulture', label: 'Horticulture (Fruits, Vegetables, Spices)' },
      { value: 'commercial', label: 'Commercial (Cotton, Sugarcane, Jute)' },
      { value: 'livestock', label: 'Livestock / Dairy' }
    ]
  },
  {
    id: 'farmerType',
    question: 'What best describes you?',
    options: [
      { value: 'small', label: 'Small / Marginal farmer (< 2 ha)' },
      { value: 'medium', label: 'Medium farmer (2–5 ha)' },
      { value: 'large', label: 'Large / Commercial farmer (> 5 ha)' },
      { value: 'tenant', label: 'Tenant / Sharecropper' }
    ]
  }
];

export const getRecommendations = (answers) => {
  const plans = getInsurancePlans();
  const { region, cropType, farmerType } = answers;
  const results = [];

  if (cropType === 'livestock') {
    results.push({ plan: plans.find(p => p.id === 'livestock'), reason: 'Livestock insurance is the primary option for dairy/cattle farmers.', priority: 1 });
    results.push({ plan: plans.find(p => p.id === 'pmfby'), reason: 'If you also grow crops, pair with PMFBY for crop coverage.', priority: 2 });
    return results;
  }

  if (farmerType === 'small' || farmerType === 'tenant' || cropType === 'foodgrain' || cropType === 'oilseed') {
    results.push({ plan: plans.find(p => p.id === 'pmfby'), reason: 'PMFBY offers low premiums backed by high subsidies. Best fit for your profile.', priority: 1 });
  }

  if (cropType === 'horticulture' || region === 'western' || region === 'central') {
    results.push({ plan: plans.find(p => p.id === 'rwbcis'), reason: 'RWBCIS is ideal for horticultural crops — auto-settlement via weather stations.', priority: cropType === 'horticulture' ? 1 : 2 });
  }

  if (region === 'northeast' || region === 'hilly' || region === 'coastal') {
    results.push({ plan: plans.find(p => p.id === 'localized'), reason: 'Frequent local perils exist in your region. Localized peril add-on gives individual farm-level coverage.', priority: 2 });
  }

  if (farmerType === 'large' || cropType === 'commercial') {
    results.push({ plan: plans.find(p => p.id === 'comprehensive'), reason: 'Large/commercial farms benefit from comprehensive multi-risk policies.', priority: 2 });
  }

  if (farmerType === 'small' || farmerType === 'tenant') {
    results.push({ plan: plans.find(p => p.id === 'unified'), reason: 'UPIS bundles crop, life, and accident cover in one affordable package.', priority: 3 });
  }

  const seen = new Set();
  return results.filter(r => {
    if (seen.has(r.plan.id)) return false;
    seen.add(r.plan.id);
    return true;
  }).sort((a, b) => a.priority - b.priority);
};

// Calculate premium for a specific plan
export const calculatePremium = (plan, landAreaHa, season, cropType) => {
  if (plan.fixedPremium) {
    return { premium: plan.fixedPremium, sumInsured: plan.sumInsuredPerHa * landAreaHa };
  }

  let pct = 0;
  if (season === 'kharif') pct = plan.premiumKharifPct;
  else if (season === 'rabi') pct = plan.premiumRabiPct;
  else pct = plan.premiumHortiPct || plan.premiumKharifPct;

  if (cropType === 'horticulture') pct = plan.premiumHortiPct;

  const totalSumInsured = plan.sumInsuredPerHa * landAreaHa;
  const premium = Math.round((pct / 100) * totalSumInsured);

  return { premium, sumInsured: totalSumInsured, pct };
};

// ─── APPLICATION STORAGE (localStorage) ──────────────────────────────────────

const STORAGE_KEY = 'krishi_insurance_applications';
const SEEDED_KEY = 'krishi_insurance_seeded';

const DUMMY_APPLICATIONS = [
  {
    applicationId: 'KRISHI-INS-A1B2C3',
    userId: 'anonymous',
    userName: 'Ramesh Patil',
    fullName: 'Ramesh Patil',
    planId: 'pmfby',
    planName: 'Pradhan Mantri Fasal Bima Yojana',
    planTag: 'Most Popular',
    aadhaar: '876543210987',
    phone: '9876543210',
    location: 'Baramati, Pune District, Maharashtra',
    landArea: 3.5,
    bankAccount: '12345678901234',
    season: 'kharif',
    region: 'western',
    cropType: 'foodgrain',
    farmerType: 'medium',
    premiumAmount: 2849,
    sumInsured: 142450,
    submittedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    status: 'Approved',
    statusHistory: [
      { status: 'Submitted', date: new Date(Date.now() - 15 * 86400000).toISOString(), note: 'Application submitted successfully' },
      { status: 'Under Review', date: new Date(Date.now() - 10 * 86400000).toISOString(), note: 'Documents under verification by district agriculture officer' },
      { status: 'Approved', date: new Date(Date.now() - 3 * 86400000).toISOString(), note: 'Application approved. Policy ID: PMFBY-MH-2026-78432' }
    ]
  },
  {
    applicationId: 'KRISHI-INS-D4E5F6',
    userId: 'anonymous',
    userName: 'Sunita Devi',
    fullName: 'Sunita Devi',
    planId: 'rwbcis',
    planName: 'Restructured Weather Based Crop Insurance Scheme',
    planTag: 'Weather-Based',
    aadhaar: '234567890123',
    phone: '8765432109',
    location: 'Nashik, Maharashtra',
    landArea: 1.2,
    bankAccount: '98765432109876',
    season: 'rabi',
    region: 'western',
    cropType: 'horticulture',
    farmerType: 'small',
    premiumAmount: 900,
    sumInsured: 60000,
    submittedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    status: 'Under Review',
    statusHistory: [
      { status: 'Submitted', date: new Date(Date.now() - 8 * 86400000).toISOString(), note: 'Application submitted successfully' },
      { status: 'Under Review', date: new Date(Date.now() - 5 * 86400000).toISOString(), note: 'Weather station proximity being verified' }
    ]
  },
  {
    applicationId: 'KRISHI-INS-G7H8I9',
    userId: 'anonymous',
    userName: 'Arjun Singh',
    fullName: 'Arjun Singh',
    planId: 'comprehensive',
    planName: 'Comprehensive Multi-Risk Crop Insurance (Private/AIC)',
    planTag: 'Commercial',
    aadhaar: '345678901234',
    phone: '7654321098',
    location: 'Ludhiana, Punjab',
    landArea: 8,
    bankAccount: '55667788990011',
    season: 'kharif',
    region: 'northwest',
    cropType: 'commercial',
    farmerType: 'large',
    premiumAmount: 64000,
    sumInsured: 800000,
    submittedAt: new Date(Date.now() - 22 * 86400000).toISOString(),
    status: 'Approved',
    statusHistory: [
      { status: 'Submitted', date: new Date(Date.now() - 22 * 86400000).toISOString(), note: 'Application submitted successfully' },
      { status: 'Under Review', date: new Date(Date.now() - 18 * 86400000).toISOString(), note: 'Field inspection scheduled' },
      { status: 'Approved', date: new Date(Date.now() - 12 * 86400000).toISOString(), note: 'Approved by AIC underwriter. Policy active.' }
    ]
  },
  {
    applicationId: 'KRISHI-INS-J1K2L3',
    userId: 'anonymous',
    userName: 'Meena Kumari',
    fullName: 'Meena Kumari',
    planId: 'unified',
    planName: 'Unified Package Insurance Scheme (Bhartiya Krishi Bima)',
    planTag: 'Bundle',
    aadhaar: '456789012345',
    phone: '6543210987',
    location: 'Varanasi, Uttar Pradesh',
    landArea: 1.8,
    bankAccount: '11223344556677',
    season: 'rabi',
    region: 'northwest',
    cropType: 'foodgrain',
    farmerType: 'small',
    premiumAmount: 2250,
    sumInsured: 73260,
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'Submitted',
    statusHistory: [
      { status: 'Submitted', date: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Application submitted successfully' }
    ]
  },
  {
    applicationId: 'KRISHI-INS-M4N5O6',
    userId: 'anonymous',
    userName: 'Prakash Reddy',
    fullName: 'Prakash Reddy',
    planId: 'livestock',
    planName: 'National Livestock Mission Insurance / State Schemes',
    planTag: 'Livestock',
    aadhaar: '567890123456',
    phone: '9988776655',
    location: 'Karimnagar, Telangana',
    landArea: 2.5,
    bankAccount: '99887766554433',
    season: 'kharif',
    region: 'southern',
    cropType: 'livestock',
    farmerType: 'medium',
    premiumAmount: 4688,
    sumInsured: 125000,
    submittedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    status: 'Rejected',
    statusHistory: [
      { status: 'Submitted', date: new Date(Date.now() - 30 * 86400000).toISOString(), note: 'Application submitted successfully' },
      { status: 'Under Review', date: new Date(Date.now() - 25 * 86400000).toISOString(), note: 'Veterinary inspection scheduled' },
      { status: 'Rejected', date: new Date(Date.now() - 20 * 86400000).toISOString(), note: 'Rejected: Livestock ear-tag documentation incomplete. Please reapply with valid tags.' }
    ]
  }
];

// Seed dummy data on first load
const seedDummyData = () => {
  if (!localStorage.getItem(SEEDED_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_APPLICATIONS));
    localStorage.setItem(SEEDED_KEY, 'true');
  }
};
seedDummyData();

export const saveApplication = (application) => {
  const apps = getApplications();
  const newApp = {
    ...application,
    applicationId: `KRISHI-INS-${Date.now().toString(36).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    status: 'Submitted',
    statusHistory: [
      { status: 'Submitted', date: new Date().toISOString(), note: 'Application submitted successfully' }
    ]
  };
  apps.push(newApp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  return newApp;
};

export const getApplications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getApplicationsByUser = (userId) => {
  return getApplications().filter(app => app.userId === userId);
};
