# Multi-Language Configuration Guide

## Setup Instructions

### 1. Environment Configuration

Add your Lingo.dev API key to your `.env.local` file:

```
VITE_LINGO_API_KEY=your_lingo_dev_api_key_here
```

**Note:** 
- Copy `.env.example` to `.env.local` 
- Never commit `.env.local` to version control
- Add `.env.local` to `.gitignore`

### 2. How the Translation Feature Works

The multi-language feature is now integrated into all pages of your application:

#### Language Switcher Button
- **Location**: Fixed at the top-right corner of the page
- **Features**:
  - Dropdown selector for 3 languages (English, Marathi, Gujarati, Tamil)
  - Clear button (appears when translation is active) to reset to English
  - Status indicator showing current translation progress
  - Loading spinner during translation

#### Supported Languages
- 🌐 English (default)
- 🇮🇳 Marathi
- 🇮🇳 Gujarati
- 🇮🇳 Tamil

### 3. How to Use

1. Click the language button in the top-right corner of any page
2. Select your preferred language from the dropdown
3. The entire page content will be translated to that language
4. A confirmation badge shows the current language
5. Use the clear button to reset back to English

### 4. Features

- **Automatic Translation**: Uses Lingo.dev API for accurate translations
- **Page-wide Coverage**: Translates all text content on the page
- **Persistent State**: Language preference is saved in browser localStorage
- **Responsive Design**: Works perfectly on mobile and desktop
- **Non-blocking**: Translation happens in the background with visual feedback
- **Error Handling**: Falls back gracefully if translation fails

### 5. Technical Details

#### Files Added
- `src/context/LanguageContext.jsx` - Language state management
- `src/services/translationService.js` - Translation API integration
- `src/components/common/LanguageSwitcher.jsx` - UI component
- `src/components/common/LanguageSwitcher.css` - Styling

#### How Translation Works
1. PageContent is extracted from the DOM
2. Text is divided into chunks (max 5000 chars per API call)
3. Each chunk is sent to Lingo.dev API
4. Translated text is applied back to the page
5. DOM nodes are updated with translated content

### 6. Customization

#### Add More Languages
Edit `translationService.js`:
```javascript
const LANGUAGE_CONFIG = {
  'mr': { name: 'Marathi', code: 'mr' },
  'gu': { name: 'Gujarati', code: 'gu' },
  'ta': { name: 'Tamil', code: 'ta' },
  // Add more here:
  'hi': { name: 'Hindi', code: 'hi' }
};
```

And update `LanguageSwitcher.jsx`:
```javascript
const languages = getAvailableLanguages();
// Returns array with all configured languages
```

#### Styling
Modify `LanguageSwitcher.css` to match your app's theme:
- Update gradient colors: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Adjust padding/margins for your layout
- Change animations as needed

### 7. Troubleshooting

**Issue**: "Translation failed" error
- Solution: Check your Lingo.dev API key is correct
- Verify the API key has proper permissions

**Issue**: Only partial page is translated
- This is normal for complex pages
- The feature skips buttons, inputs, and script content
- Text in certain elements may not be translatable

**Issue**: Performance is slow
- Reduce the amount of text on the page
- Consider lazy-loading content
- Lingo.dev API speed depends on your internet connection

### 8. Lingo.dev API Reference

For more information on Lingo.dev API:
- Visit: https://lingo.dev
- Docs: https://docs.lingo.dev
- API Endpoint: `https://api.lingo.dev/translate`

#### API Request Format
```javascript
{
  text: "Text to translate",
  source_language: "en",
  target_language: "mr", // Language code
  format: "text"
}
```

Headers:
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### 9. Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

### 10. Notes

- First translation may take 2-5 seconds depending on page size
- Subsequent translations are faster due to caching
- Refreshing the page shows the translated version
- Language preference persists across sessions (localStorage)
