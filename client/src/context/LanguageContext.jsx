import { createContext, useState, useContext, useCallback } from 'react';
import { translatePageContent } from '../services/translationService';

const LanguageContext = createContext({
  currentLanguage: 'en',
  setCurrentLanguage: () => {},
  isTranslating: false,
  translatePage: async () => {},
  resetLanguage: () => {}
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translatePage = useCallback(async (targetLanguage) => {
    if (targetLanguage === 'en') {
      // If switching back to English, reload the page
      window.location.reload();
      return;
    }

    try {
      setIsTranslating(true);
      await translatePageContent(targetLanguage);
      setCurrentLanguage(targetLanguage);
    } catch (error) {
      console.error('Translation error:', error);
      setIsTranslating(false);
    }
  }, []);

  const resetLanguage = useCallback(() => {
    setCurrentLanguage('en');
    window.location.reload();
  }, []);

  const value = {
    currentLanguage,
    setCurrentLanguage,
    isTranslating,
    translatePage,
    resetLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
