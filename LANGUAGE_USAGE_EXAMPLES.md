// Example: How to Use the Language Feature in Your Components

import { useLanguage } from '../context/LanguageContext';

// ============================================
// Example 1: Display Current Language
// ============================================
function LanguageStatus() {
  const { currentLanguage } = useLanguage();

  const languageNames = {
    'en': 'English',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'ta': 'Tamil'
  };

  return (
    <div>
      <p>Current Language: {languageNames[currentLanguage]}</p>
    </div>
  );
}

// ============================================
// Example 2: Manual Language Switch
// ============================================
function LanguageSelectorButton() {
  const { currentLanguage, translatePage, isTranslating } = useLanguage();

  const handleTranslate = async (lang) => {
    try {
      await translatePage(lang);
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={() => handleTranslate('mr')}
        disabled={isTranslating}
      >
        {isTranslating ? 'Translating...' : 'Translate to Marathi'}
      </button>
    </div>
  );
}

// ============================================
// Example 3: Conditional Rendering Based on Language
// ============================================
function MultilingualContent() {
  const { currentLanguage } = useLanguage();

  const content = {
    'en': { title: 'Welcome!', message: 'Hello!' },
    'mr': { title: 'स्वागत आहे!', message: 'नमस्कार!' },
    'gu': { title: 'આપનું સ્વાગત છે!', message: 'નમસ્તે!' },
    'ta': { title: 'வரவேற்கிறோம்!', message: 'வணக்கம்!' }
  };

  const currentContent = content[currentLanguage] || content['en'];

  return (
    <div>
      <h1>{currentContent.title}</h1>
      <p>{currentContent.message}</p>
    </div>
  );
}

// ============================================
// Example 4: Show Language-Specific Features
// ============================================
function CultureAwareFeature() {
  const { currentLanguage } = useLanguage();

  // Some features might work differently based on language
  const shouldShowFeature = () => {
    // Example: only show for Indian languages
    return ['mr', 'gu', 'ta'].includes(currentLanguage);
  };

  return (
    <div>
      {shouldShowFeature() && (
        <button>Indian Language Specific Feature</button>
      )}
    </div>
  );
}

// ============================================
// Example 5: Translate Page on Route Change
// ============================================
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AutoTranslateOnNavigation() {
  const { currentLanguage, translatePage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // When user navigates to a new page,
    // automatically apply the saved language preference
    if (currentLanguage !== 'en') {
      // Slight delay to ensure DOM is ready
      const timer = setTimeout(() => {
        translatePage(currentLanguage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [navigate, currentLanguage, translatePage]);

  return null; // This component doesn't render anything
}

// ============================================
// Example 6: Hook into Translation Events
// ============================================
function TranslationNotification() {
  const { isTranslating, currentLanguage } = useLanguage();

  return (
    <div>
      {isTranslating && (
        <div className="notification">
          🌍 Translating page...
        </div>
      )}
      {!isTranslating && currentLanguage !== 'en' && (
        <div className="notification">
          ✓ Translation complete!
        </div>
      )}
    </div>
  );
}

// ============================================
// Example 7: Full Integration in a Page
// ============================================
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

function MultilingualDashboard() {
  const { currentLanguage, translatePage, isTranslating } = useLanguage();
  const [stats, setStats] = useState({
    'en': { title: 'Dashboard', count: 'Total Farms: 5' },
    'mr': { title: 'डॅशबोर्ड', count: 'एकूण शेते: 5' },
    'gu': { title: 'ડેશબોર્ડ', count: 'કુલ ખેતર: 5' },
    'ta': { title: 'டேஷ்போர்ட்', count: 'மொத்த பண்ணைகள்: 5' }
  });

  useEffect(() => {
    // Load language preference on mount
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== 'en') {
      // Auto-apply saved language
      translatePage(savedLanguage);
    }
  }, [translatePage]);

  const currentStats = stats[currentLanguage] || stats['en'];

  return (
    <div>
      <h1>{currentStats.title}</h1>
      <p>{currentStats.count}</p>
      {isTranslating && <p>Translating...</p>}
    </div>
  );
}

// ============================================
// Example 8: Language-Specific API Calls
// ============================================
async function fetchDataInCurrentLanguage(language) {
  const languageCode = {
    'en': 'en',
    'mr': 'mr-IN',
    'gu': 'gu-IN',
    'ta': 'ta-IN'
  };

  const response = await fetch(`/api/data?lang=${languageCode[language]}`);
  return response.json();
}

// ============================================
// Example 9: Reset Language Manually
// ============================================
import { useLanguage } from '../context/LanguageContext';

function LanguageReset() {
  const { resetLanguage } = useLanguage();

  return (
    <button onClick={resetLanguage}>
      Reset to English
    </button>
  );
}

// ============================================
// Example 10: Custom Translation Hook
// ============================================
function useCurrentLanguageName() {
  const { currentLanguage } = useLanguage();

  const names = {
    'en': 'English',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'ta': 'Tamil'
  };

  return names[currentLanguage] || 'English';
}

// Usage:
function ShowLanguage() {
  const langName = useCurrentLanguageName();
  return <p>Current: {langName}</p>;
}

// ============================================
// Example 11: Get All Available Languages
// ============================================
import { getAvailableLanguages } from '../services/translationService';

function LanguageList() {
  const languages = getAvailableLanguages();

  return (
    <ul>
      {languages.map(lang => (
        <li key={lang.code}>
          {lang.icon} {lang.name}
        </li>
      ))}
    </ul>
  );
}

// ============================================
// Example 12: Combine with Your Existing Context
// ============================================
import { useLanguage } from '../context/LanguageContext';
import { useAppContext } from '../context/AppContext';

function IntegratedComponent() {
  const { currentLanguage } = useLanguage();
  const { selectedField } = useAppContext();

  return (
    <div>
      <p>Language: {currentLanguage}</p>
      <p>Selected Field: {selectedField}</p>
    </div>
  );
}

export {
  LanguageStatus,
  LanguageSelectorButton,
  MultilingualContent,
  CultureAwareFeature,
  AutoTranslateOnNavigation,
  TranslationNotification,
  MultilingualDashboard,
  fetchDataInCurrentLanguage,
  LanguageReset,
  useCurrentLanguageName,
  LanguageList,
  IntegratedComponent
};
