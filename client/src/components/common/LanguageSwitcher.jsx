import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: t('common.english'), icon: '🌐' },
    { code: 'mr', name: t('common.marathi'), icon: '🇮🇳' },
    { code: 'gu', name: t('common.gujarati'), icon: '🇮🇳' },
    { code: 'ta', name: t('common.tamil'), icon: '🇮🇳' }
  ];

  const currentLangDisplay = languages.find(lang => lang.code === i18n.language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Close dropdown on Escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLanguageSelect = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    // Store language preference
    localStorage.setItem('i18nextLng', languageCode);
  };

  return (
    <div className="language-switcher-container">
      {/* Main Language Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`language-switcher-button ${isOpen ? 'active' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <FontAwesomeIcon 
          icon={faGlobe} 
          className="language-icon"
        />
        <span className="language-text">
          {currentLangDisplay?.name || 'Language'}
        </span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`chevron-icon ${isOpen ? 'open' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="language-dropdown-menu"
          role="listbox"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`language-dropdown-item ${i18n.language === language.code ? 'active' : ''}`}
              role="option"
              aria-selected={i18n.language === language.code}
            >
              <span className="language-flag">{language.icon}</span>
              <span className="language-name">{language.name}</span>
              {i18n.language === language.code && (
                <span className="checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
