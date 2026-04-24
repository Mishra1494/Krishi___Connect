import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot, faShieldAlt, faCheckCircle, faArrowLeft,
  faFileAlt, faIndianRupeeSign, faUser, faPhone,
  faMapMarkerAlt, faCalendarCheck, faIdCard, faSeedling,
  faLandmark, faChevronRight, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import {
  getInsurancePlans, getRecommendationQuestions,
  getRecommendations, calculatePremium, saveApplication
} from '../../data/insuranceData';
import { useAuth } from '../../context/AuthContext';

const STEPS = {
  WELCOME: 'welcome',
  REGION: 'region',
  CROP_TYPE: 'cropType',
  FARMER_TYPE: 'farmerType',
  RECOMMENDATION: 'recommendation',
  TERMS: 'terms',
  FORM_NAME: 'form_name',
  FORM_AADHAAR: 'form_aadhaar',
  FORM_PHONE: 'form_phone',
  FORM_LOCATION: 'form_location',
  FORM_LAND: 'form_land',
  FORM_BANK: 'form_bank',
  FORM_SEASON: 'form_season',
  REVIEW: 'review',
  CONFIRMED: 'confirmed'
};

const STEP_ORDER = Object.values(STEPS);

const InsuranceAgent = ({ onClose, onApplicationSubmitted }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(STEPS.WELCOME);
  const [answers, setAnswers] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const questions = getRecommendationQuestions();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  const addBotMsg = (content, options, extra) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', content, options, ...extra }]);
    }, 600);
  };

  const addUserMsg = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: text }]);
  };

  // Initialize
  useEffect(() => {
    addBotMsg(
      "🛡️ Welcome to the **Insurance Application Agent**!\n\nI'll help you find the best crop insurance plan and complete your application — all right here.\n\nLet's start! Which region is your farm in?",
      questions[0].options.map(o => ({ label: o.label, value: o.value }))
    );
    setStep(STEPS.REGION);
  }, []);

  const handleOptionClick = (value, label) => {
    addUserMsg(label);

    if (step === STEPS.REGION) {
      setAnswers(p => ({ ...p, region: value }));
      setTimeout(() => {
        addBotMsg("Great! What type of crop do you grow?", questions[1].options.map(o => ({ label: o.label, value: o.value })));
        setStep(STEPS.CROP_TYPE);
      }, 300);
    } else if (step === STEPS.CROP_TYPE) {
      setAnswers(p => ({ ...p, cropType: value }));
      setTimeout(() => {
        addBotMsg("And what best describes you as a farmer?", questions[2].options.map(o => ({ label: o.label, value: o.value })));
        setStep(STEPS.FARMER_TYPE);
      }, 300);
    } else if (step === STEPS.FARMER_TYPE) {
      const finalAnswers = { ...answers, farmerType: value };
      setAnswers(finalAnswers);
      setTimeout(() => showRecommendations(finalAnswers), 300);
    } else if (step === STEPS.FORM_SEASON) {
      setFormData(p => ({ ...p, season: value }));
      setTimeout(() => showReview({ ...formData, season: value }), 300);
    }
  };

  const showRecommendations = (ans) => {
    const recs = getRecommendations(ans);
    const plans = recs.slice(0, 3);
    addBotMsg(
      "🎯 Based on your profile, here are the **best insurance plans** for you:",
      null,
      { recommendations: plans }
    );
    setStep(STEPS.RECOMMENDATION);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    addUserMsg(`I want to apply for: ${plan.fullName}`);
    setTimeout(() => {
      const tcText = plan.termsAndConditions.map((t, i) => `${i + 1}. ${t}`).join('\n');
      addBotMsg(
        `📋 **Terms & Conditions — ${plan.name}**\n\n${tcText}\n\n**Premium Details:**\n• Kharif: ${plan.premiumKharif}\n• Rabi: ${plan.premiumRabi}\n• Horticulture: ${plan.premiumHorti}\n• Govt Subsidy: ${plan.govtSubsidy}\n• Claim Window: ${plan.claimWindow}`,
        [{ label: '✅ I Accept — Continue to Application', value: 'accept' }, { label: '← Go Back', value: 'back' }],
        { isTerms: true }
      );
      setStep(STEPS.TERMS);
    }, 300);
  };

  const handleTermsResponse = (value) => {
    if (value === 'accept') {
      addUserMsg("I accept the terms & conditions");
      setTimeout(() => {
        addBotMsg("Let's fill your application. What is your **full name**?");
        setStep(STEPS.FORM_NAME);
      }, 300);
    } else {
      addUserMsg("Go back to recommendations");
      setTimeout(() => showRecommendations(answers), 300);
    }
  };

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    const val = inputValue.trim();
    setInputValue('');
    addUserMsg(val);

    switch (step) {
      case STEPS.FORM_NAME:
        setFormData(p => ({ ...p, fullName: val }));
        setTimeout(() => { addBotMsg("Please enter your **Aadhaar Number** (12 digits):"); setStep(STEPS.FORM_AADHAAR); }, 300);
        break;
      case STEPS.FORM_AADHAAR:
        if (!/^\d{12}$/.test(val.replace(/\s/g, ''))) {
          setTimeout(() => addBotMsg("⚠️ Aadhaar must be exactly 12 digits. Please try again:"), 300);
          return;
        }
        setFormData(p => ({ ...p, aadhaar: val.replace(/\s/g, '') }));
        setTimeout(() => { addBotMsg("Your **phone number** (10 digits):"); setStep(STEPS.FORM_PHONE); }, 300);
        break;
      case STEPS.FORM_PHONE:
        if (!/^\d{10}$/.test(val.replace(/\s/g, ''))) {
          setTimeout(() => addBotMsg("⚠️ Phone number must be 10 digits. Please try again:"), 300);
          return;
        }
        setFormData(p => ({ ...p, phone: val.replace(/\s/g, '') }));
        setTimeout(() => { addBotMsg("Your **farm location / village name**:"); setStep(STEPS.FORM_LOCATION); }, 300);
        break;
      case STEPS.FORM_LOCATION:
        setFormData(p => ({ ...p, location: val }));
        setTimeout(() => { addBotMsg("Your **total land area** (in hectares):"); setStep(STEPS.FORM_LAND); }, 300);
        break;
      case STEPS.FORM_LAND:
        const area = parseFloat(val);
        if (isNaN(area) || area <= 0) {
          setTimeout(() => addBotMsg("⚠️ Please enter a valid number for land area in hectares:"), 300);
          return;
        }
        setFormData(p => ({ ...p, landArea: area }));
        setTimeout(() => { addBotMsg("Your **bank account number** (for claim settlement):"); setStep(STEPS.FORM_BANK); }, 300);
        break;
      case STEPS.FORM_BANK:
        setFormData(p => ({ ...p, bankAccount: val }));
        setTimeout(() => {
          addBotMsg("Which **season** are you applying for?", [
            { label: '🌱 Kharif', value: 'kharif' },
            { label: '🌾 Rabi', value: 'rabi' },
            { label: '🍇 Horticulture (Annual)', value: 'horticulture' }
          ]);
          setStep(STEPS.FORM_SEASON);
        }, 300);
        break;
      default: break;
    }
  };

  const showReview = (fd) => {
    const premium = calculatePremium(selectedPlan, fd.landArea, fd.season, answers.cropType);
    addUserMsg(`Season: ${fd.season}`);
    setTimeout(() => {
      addBotMsg(
        "review_card", null,
        { isReview: true, reviewData: { ...fd, plan: selectedPlan, premium, answers } }
      );
      setStep(STEPS.REVIEW);
    }, 300);
  };

  const handleConfirm = () => {
    const premium = calculatePremium(selectedPlan, formData.landArea, formData.season, answers.cropType);
    const app = saveApplication({
      userId: user?.id || 'anonymous',
      userName: formData.fullName,
      planId: selectedPlan.id,
      planName: selectedPlan.fullName,
      planTag: selectedPlan.tag,
      ...formData,
      ...answers,
      premiumAmount: premium.premium,
      sumInsured: premium.sumInsured
    });
    setSubmittedApp(app);
    addUserMsg("✅ Confirm & Submit Application");
    setTimeout(() => {
      addBotMsg(
        `🎉 **Application Submitted Successfully!**\n\n📋 Application ID: **${app.applicationId}**\n📅 Date: ${new Date(app.submittedAt).toLocaleDateString('en-IN')}\n🛡️ Plan: ${selectedPlan.fullName}\n💰 Premium: ₹${premium.premium.toLocaleString('en-IN')}\n\nYou can track your application status in the **"My Applications"** section.\n\nThank you for choosing KrishiConnect! 🌾`,
        null, { isSuccess: true }
      );
      setStep(STEPS.CONFIRMED);
      onApplicationSubmitted?.();
    }, 300);
  };

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = Math.min(Math.round(((stepIndex) / (STEP_ORDER.length - 1)) * 100), 100);

  const maskAadhaar = (a) => a ? `XXXX-XXXX-${a.slice(-4)}` : '';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-4 py-3 flex items-center gap-3 shadow-md">
        <button onClick={onClose} className="text-white/80 hover:text-white transition p-1">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="bg-white/20 p-2 rounded-full">
          <FontAwesomeIcon icon={faShieldAlt} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-sm truncate">Insurance Agent</h2>
          <p className="text-emerald-100 text-xs">Guided Application</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-emerald-100">Step {Math.min(stepIndex + 1, STEP_ORDER.length)}/{STEP_ORDER.length}</span>
          <div className="w-20 h-1.5 bg-white/20 rounded-full mt-1">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
              msg.sender === 'user'
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-sm'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
            }`}>
              {msg.sender === 'bot' && (
                <div className="flex items-center gap-1.5 mb-1.5 text-emerald-600">
                  <FontAwesomeIcon icon={faRobot} className="text-xs" />
                  <span className="text-[11px] font-semibold">Insurance Agent</span>
                </div>
              )}

              {/* Recommendation Cards */}
              {msg.recommendations && (
                <div className="space-y-2 mt-2">
                  <p className="whitespace-pre-wrap text-sm mb-2">{msg.content}</p>
                  {msg.recommendations.map((rec, i) => (
                    <div key={rec.plan.id} className="border border-emerald-200 rounded-xl p-3 bg-gradient-to-br from-emerald-50 to-white">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${rec.plan.tagColor}`}>{rec.plan.tag}</span>
                          <h4 className="font-bold text-slate-900 text-sm">{rec.plan.fullName}</h4>
                        </div>
                        {i === 0 && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold shrink-0">Best Match</span>}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{rec.reason}</p>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] mb-2">
                        <div className="bg-slate-50 rounded-lg p-1.5"><span className="text-slate-500">Kharif:</span> <span className="font-semibold text-emerald-700">{rec.plan.premiumKharif}</span></div>
                        <div className="bg-slate-50 rounded-lg p-1.5"><span className="text-slate-500">Rabi:</span> <span className="font-semibold text-emerald-700">{rec.plan.premiumRabi}</span></div>
                        <div className="bg-slate-50 rounded-lg p-1.5"><span className="text-slate-500">Subsidy:</span> <span className="font-semibold">{rec.plan.govtSubsidy}</span></div>
                        <div className="bg-slate-50 rounded-lg p-1.5"><span className="text-slate-500">Claim:</span> <span className="font-semibold">{rec.plan.claimSettlement}</span></div>
                      </div>
                      <button
                        onClick={() => handleSelectPlan(rec.plan)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faFileAlt} /> Apply for {rec.plan.name} <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Card */}
              {msg.isReview && msg.reviewData && (
                <div className="mt-1">
                  <p className="font-bold text-emerald-800 mb-2">📋 Application Summary — Please Review</p>
                  <div className="border border-emerald-200 rounded-xl overflow-hidden">
                    <div className="bg-emerald-600 text-white px-3 py-2">
                      <p className="font-bold text-sm">{msg.reviewData.plan.fullName}</p>
                      <p className="text-emerald-100 text-xs">{msg.reviewData.plan.tag}</p>
                    </div>
                    <div className="p-3 space-y-2 text-xs bg-white">
                      {[
                        { icon: faUser, label: 'Name', value: msg.reviewData.fullName },
                        { icon: faIdCard, label: 'Aadhaar', value: maskAadhaar(msg.reviewData.aadhaar) },
                        { icon: faPhone, label: 'Phone', value: msg.reviewData.phone },
                        { icon: faMapMarkerAlt, label: 'Location', value: msg.reviewData.location },
                        { icon: faSeedling, label: 'Land Area', value: `${msg.reviewData.landArea} hectares` },
                        { icon: faLandmark, label: 'Bank A/C', value: `XXXX${msg.reviewData.bankAccount.slice(-4)}` },
                        { icon: faCalendarCheck, label: 'Season', value: msg.reviewData.season?.charAt(0).toUpperCase() + msg.reviewData.season?.slice(1) },
                      ].map(row => (
                        <div key={row.label} className="flex items-center gap-2">
                          <FontAwesomeIcon icon={row.icon} className="text-emerald-600 w-3.5" />
                          <span className="text-slate-500 w-16">{row.label}:</span>
                          <span className="font-semibold text-slate-800">{row.value}</span>
                        </div>
                      ))}
                      <hr className="border-slate-100 my-2" />
                      <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-2">
                        <FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-700" />
                        <div>
                          <p className="text-slate-600">Premium Payable</p>
                          <p className="font-bold text-lg text-emerald-700">₹{msg.reviewData.premium.premium.toLocaleString('en-IN')}</p>
                          <p className="text-slate-500">Sum Insured: ₹{msg.reviewData.premium.sumInsured.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleConfirm} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
                      <FontAwesomeIcon icon={faCheckCircle} /> Confirm & Submit
                    </button>
                    <button onClick={() => { setStep(STEPS.FORM_NAME); addBotMsg("Let's redo the form. What is your **full name**?"); }} className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Success Card */}
              {msg.isSuccess && (
                <div className="mt-1">
                  <div className="text-center py-3">
                    <div className="w-14 h-14 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-2xl" />
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              )}

              {/* Regular text */}
              {!msg.recommendations && !msg.isReview && !msg.isSuccess && (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}

              {/* Option buttons */}
              {msg.options && step !== STEPS.CONFIRMED && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {msg.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (msg.isTerms) handleTermsResponse(opt.value);
                        else handleOptionClick(opt.value, opt.label);
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-full text-xs font-medium transition hover:shadow-sm"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="text-emerald-600 animate-spin text-xs" />
                <div className="flex gap-1"><span className="bg-emerald-300 w-1.5 h-1.5 rounded-full animate-pulse" /><span className="bg-emerald-300 w-1.5 h-1.5 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} /><span className="bg-emerald-300 w-1.5 h-1.5 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} /></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {[STEPS.FORM_NAME, STEPS.FORM_AADHAAR, STEPS.FORM_PHONE, STEPS.FORM_LOCATION, STEPS.FORM_LAND, STEPS.FORM_BANK].includes(step) && (
        <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            ref={inputRef}
            type={step === STEPS.FORM_AADHAAR || step === STEPS.FORM_PHONE ? 'tel' : 'text'}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={
              step === STEPS.FORM_NAME ? 'Enter your full name...' :
              step === STEPS.FORM_AADHAAR ? '12-digit Aadhaar number...' :
              step === STEPS.FORM_PHONE ? '10-digit phone number...' :
              step === STEPS.FORM_LOCATION ? 'Village / District / State...' :
              step === STEPS.FORM_LAND ? 'e.g. 2.5' :
              'Bank account number...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            autoComplete="off"
          />
          <button type="submit" disabled={!inputValue.trim()} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition">
            Send
          </button>
        </form>
      )}

      {step === STEPS.CONFIRMED && (
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition">
            Back to Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default InsuranceAgent;
