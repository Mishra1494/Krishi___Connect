const LINGO_API_KEY = import.meta.env.VITE_LINGO_API_KEY || 'YOUR_API_KEY_HERE';

const LANGUAGE_CONFIG = {
  'mr': { name: 'Marathi', code: 'mr' },
  'gu': { name: 'Gujarati', code: 'gu' },
  'ta': { name: 'Tamil', code: 'ta' }
};

/**
 * Translate page content using Lingo.dev API
 * @param {string} targetLanguage - Target language code (mr, gu, ta)
 */
export const translatePageContent = async (targetLanguage) => {
  try {
    // Get all text content from the page
    const pageText = getPageText();
    
    if (!pageText.length) {
      console.warn('No text content found to translate');
      return;
    }

    // Split text into chunks for API call (API limits apply)
    const chunks = chunkText(pageText, 5000); // 5000 chars per request
    const translatedChunks = [];

    for (const chunk of chunks) {
      const translated = await callLingoAPI(chunk, targetLanguage);
      translatedChunks.push(translated);
    }

    // Apply translations to the page
    applyTranslations(translatedChunks, targetLanguage);

    // Store language preference
    localStorage.setItem('preferredLanguage', targetLanguage);
    document.documentElement.lang = LANGUAGE_CONFIG[targetLanguage]?.code || 'en';
  } catch (error) {
    console.error('Error translating page:', error);
    throw error;
  }
};

/**
 * Call Lingo.dev API for translation
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 */
const callLingoAPI = async (text, targetLanguage) => {
  try {
    const response = await fetch('https://api.lingo.dev/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINGO_API_KEY}`
      },
      body: JSON.stringify({
        text: text,
        source_language: 'en',
        target_language: LANGUAGE_CONFIG[targetLanguage]?.code || targetLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.translated_text || data.result || data.text;
  } catch (error) {
    console.error('Lingo.dev API Error:', error);
    // Fallback: return original text if API fails
    return text;
  }
};

/**
 * Extract all text content from the page (excluding scripts, styles, etc)
 */
const getPageText = () => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const texts = [];
  let node;

  while (node = walker.nextNode()) {
    const text = node.textContent.trim();
    // Only include non-empty text nodes that are not in script/style tags
    if (text.length > 0 && 
        !isInScriptOrStyle(node) &&
        !isInButton(node) &&
        text.length < 500) { // Skip very long texts
      texts.push({ node, text });
    }
  }

  return texts;
};

/**
 * Check if node is inside script or style tags
 */
const isInScriptOrStyle = (node) => {
  let parent = node.parentElement;
  while (parent) {
    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
};

/**
 * Check if node is inside button or input
 */
const isInButton = (node) => {
  let parent = node.parentElement;
  while (parent) {
    if (parent.tagName === 'BUTTON' || parent.tagName === 'INPUT') {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
};

/**
 * Split text array into chunks based on character limit
 */
const chunkText = (texts, charLimit) => {
  const chunks = [];
  let currentChunk = '';

  for (const item of texts) {
    if ((currentChunk + item.text).length > charLimit) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = item.text;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + item.text;
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

/**
 * Apply translations to the page
 */
const applyTranslations = (translatedTexts, targetLanguage) => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let textIndex = 0;
  let node;
  let translationIndex = 0;
  let translationOffset = 0;

  while (node = walker.nextNode()) {
    const text = node.textContent.trim();
    
    if (text.length > 0 && 
        !isInScriptOrStyle(node) &&
        !isInButton(node) &&
        text.length < 500) {
      
      // Get the corresponding translated text
      if (translationIndex < translatedTexts.length) {
        const translatedChunk = translatedTexts[translationIndex];
        const words = translatedChunk.split(' ');
        
        // Extract one word at a time from the translated chunk
        if (translationOffset < words.length) {
          const translatedText = words.slice(translationOffset).join(' ').substring(0, text.length);
          node.textContent = translatedText;
          
          // Move to next word in chunk
          translationOffset = (translationOffset + 1);
          
          // Move to next chunk if we've used all words
          if (translationOffset >= words.length) {
            translationIndex++;
            translationOffset = 0;
          }
        }
      }
      
      textIndex++;
    }
  }

  // Add language overlay/badge
  addLanguageBadge(targetLanguage);
};

/**
 * Add a visual indicator showing the current language
 */
const addLanguageBadge = (language) => {
  // Remove existing badge if any
  const existingBadge = document.getElementById('language-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  // Create badge
  const badge = document.createElement('div');
  badge.id = 'language-badge';
  badge.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease-out;
  `;
  badge.textContent = `Translated to ${LANGUAGE_CONFIG[language]?.name || language}`;
  
  // Add animation keyframes
  if (!document.getElementById('language-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'language-animation-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(badge);
};

/**
 * Get available languages
 */
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', icon: '🌐' },
    { code: 'mr', name: 'Marathi', icon: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', icon: '🇮🇳' },
    { code: 'ta', name: 'Tamil', icon: '🇮🇳' }
  ];
};

/**
 * Check if a language is RTL (right-to-left)
 */
export const isRTLLanguage = (language) => {
  const rtlLanguages = ['ar', 'he', 'ur'];
  return rtlLanguages.includes(language);
};
