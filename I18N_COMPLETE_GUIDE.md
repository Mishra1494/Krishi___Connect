# 🌐 i18n (Internationalization) Setup Guide

## Overview

Your Krishi Connect app now uses **i18next** for professional multi-language support with locally stored translation files instead of on-the-fly API translation.

### Key Benefits

✅ **No API Calls Required** - Translations are stored locally in JSON files  
✅ **Instant Switching** - Languages change immediately without loading delays  
✅ **Type-Safe Keys** - Use consistent translation keys across your app  
✅ **Devanagari Scripts** - Full support for Marathi, Gujarati, and Tamil scripts  
✅ **Easy Maintenance** - Update translations without code changes  
✅ **React Integrated** - Native React hooks for translation  

---

## File Structure

```
client/
├── src/
│   ├── i18n/
│   │   ├── i18n.js                    ← i18n configuration
│   │   └── locales/
│   │       ├── en/
│   │       │   └── common.json        ← English translations
│   │       ├── mr/
│   │       │   └── common.json        ← Marathi translations (मराठी)
│   │       ├── gu/
│   │       │   └── common.json        ← Gujarati translations (ગુજરાતી)
│   │       └── ta/
│   │           └── common.json        ← Tamil translations (தமிழ்)
│   ├── main.jsx                       ← Imports i18n
│   ├── App.jsx                        ← Uses i18n
│   └── components/
│       └── common/
│           └── LanguageSwitcher.jsx   ← Language selector (uses useTranslation)
├── package.json                       ← i18next dependencies added
└── .env.example                       ← Updated (no API key needed)
```

---

## Installation

All dependencies are already installed. If starting fresh, run:

```bash
cd client
npm install
```

**Dependencies added:**
- `i18next` - Core internationalization framework
- `react-i18next` - React bindings for i18next
- `i18next-browser-languagedetector` - Auto-detect user language
- `i18next-http-backend` - Load translations (optional, for future scaling)

---

## How to Use in Components

### Basic Usage with the useTranslation Hook

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      {/* Use translation keys */}
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
      
      {/* Get current language */}
      <p>Current: {i18n.language}</p>
    </div>
  );
}
```

### Using in Navigation/Headers

```jsx
function Header() {
  const { t } = useTranslation();

  return (
    <nav>
      <a href="/">{t('navigation.home')}</a>
      <a href="/fields">{t('navigation.fields')}</a>
      <a href="/crops">{t('navigation.crops')}</a>
    </nav>
  );
}
```

### Using in Forms

```jsx
function LoginForm() {
  const { t } = useTranslation();

  return (
    <form>
      <button>{t('common_actions.submit')}</button>
      <button>{t('common_actions.cancel')}</button>
    </form>
  );
}
```

### Conditional Rendering Based on Language

```jsx
function LanguageSpecificFeature() {
  const { i18n } = useTranslation();
  
  return (
    <div>
      {i18n.language === 'mr' && <MarathiContent />}
      {i18n.language === 'gu' && <GujaratiContent />}
      {i18n.language === 'ta' && <TamilContent />}
    </div>
  );
}
```

---

## Adding New Translations

### Step 1: Add Key to English Translation File

Edit `client/src/i18n/locales/en/common.json`:

```json
{
  "pages": {
    "farmConsole": "Farm Console",
    "cropDetails": "Crop Details"
  }
}
```

### Step 2: Add Translations to Other Languages

Edit each language file (mr, gu, ta):

**Marathi** (`client/src/i18n/locales/mr/common.json`):
```json
{
  "pages": {
    "farmConsole": "शेत नियंत्रण केंद्र",
    "cropDetails": "पिकाचे तपशील"
  }
}
```

**Gujarati** (`client/src/i18n/locales/gu/common.json`):
```json
{
  "pages": {
    "farmConsole": "ખેત નિયંત્રણ કેન્દ્ર",
    "cropDetails": "પાક વિગતો"
  }
}
```

**Tamil** (`client/src/i18n/locales/ta/common.json`):
```json
{
  "pages": {
    "farmConsole": "பண்ணை கட்டுப்பாட்டு மையம்",
    "cropDetails": "பயிர் விவரங்கள்"
  }
}
```

### Step 3: Use in Your Component

```jsx
function FarmConsole() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('pages.farmConsole')}</h1>
      <p>{t('pages.cropDetails')}</p>
    </div>
  );
}
```

---

## Translation Key Structure

Organize keys by feature/page:

```json
{
  "common": {
    "appName": "Krishi Connect",
    "language": "Language"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome"
  },
  "fields": {
    "title": "My Fields",
    "addField": "Add Field"
  },
  "climate": {
    "title": "Climate Analysis",
    "temperature": "Temperature"
  },
  "common_actions": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**Key Naming Convention:**
- Use lowercase with underscores
- Group related translations under a category
- Use descriptive names: `dashboard.title` not `page1_heading`

---

## Current Translation Coverage

### Basic Keys Available

**Categories:**
- `common.*` - Common words and labels
- `navigation.*` - Navigation menu items
- `dashboard.*` - Dashboard page content
- `fields.*` - Fields/Farm management
- `climate.*` - Climate analysis
- `crops.*` - Crop management
- `financialAid.*` - Financial aid/schemes
- `irrigation.*` - Irrigation management
- `common_actions.*` - Buttons and actions
- `errors.*` - Error messages
- `footer.*` - Footer content

**Languages Supported:**
- 🌐 English (en)
- 🇮🇳 Marathi (mr) - मराठी
- 🇮🇳 Gujarati (gu) - ગુજરાતી
- 🇮🇳 Tamil (ta) - தమిழ্

---

## Advanced Features

### Interpolation (Dynamic Values)

**Translation file:**
```json
{
  "welcome": "Hello, {{name}}!"
}
```

**Component:**
```jsx
function Welcome() {
  const { t } = useTranslation();
  return <h1>{t('welcome', { name: 'Farmer' })}</h1>;
  // Output: "Hello, Farmer!"
}
```

### Plural Forms

**Translation file:**
```json
{
  "farm_count": {
    "one": "You have {{count}} farm",
    "other": "You have {{count}} farms"
  }
}
```

**Component:**
```jsx
function FarmCount({ count }) {
  const { t } = useTranslation();
  return <p>{t('farm_count', { count })}</p>;
}
```

### Changing Language Programmatically

```jsx
function MyComponent() {
  const { i18n } = useTranslation();

  const switchToMarathi = () => {
    i18n.changeLanguage('mr');
  };

  const switchToGujarati = () => {
    i18n.changeLanguage('gu');
  };

  return (
    <div>
      <button onClick={switchToMarathi}>मराठी</button>
      <button onClick={switchToGujarati}>ગુજરાતી</button>
    </div>
  );
}
```

---

## Adding a New Language

### Step 1: Create Translation File

Create `client/src/i18n/locales/hi/common.json`:

```json
{
  "common": {
    "appName": "कृषि कनेक्ट",
    "language": "भाषा"
  },
  // ... all other keys
}
```

### Step 2: Update i18n.js

Edit `client/src/i18n/i18n.js`:

```javascript
import hiCommon from './locales/hi/common.json';

const resources = {
  en: { translation: enCommon },
  mr: { translation: mrCommon },
  gu: { translation: guCommon },
  ta: { translation: taCommon },
  hi: { translation: hiCommon }  // Add this
};
```

### Step 3: Test

The new language will be available in the language selector automatically!

---

## Translation Files Reference

### File Format

All files use standard JSON format:

```json
{
  "category": {
    "key": "English text",
    "subCategory": {
      "key": "Nested translation"
    }
  }
}
```

### Available Key Groups

```
common/              - App-wide terms
navigation/          - Menu and navigation
dashboard/           - Dashboard page
fields/              - Field management
climate/             - Climate analysis
crops/               - Crop management
financialAid/        - Government schemes
irrigation/          - Irrigation system
common_actions/      - Buttons and actions
errors/              - Error messages
footer/              - Footer content
```

---

## Best Practices

### 1. **Always Use Translation Keys**

❌ **Bad:**
```jsx
<h1>Dashboard</h1>
```

✅ **Good:**
```jsx
const { t } = useTranslation();
<h1>{t('dashboard.title')}</h1>
```

### 2. **Consistent Key Naming**

- Use lowercase with underscores
- Group logically: `feature.section.item`
- Example: `dashboard.weather.temperature`

### 3. **Keep Translations Synchronized**

When you add a key to one language file, add it to ALL language files to avoid missing translations.

### 4. **Test All Languages**

Test your app in each language to ensure:
- Text fits in UI
- No overlapping text
- Images/icons display correctly
- RTL support (if applicable)

### 5. **Avoid Hardcoding User Names**

Use interpolation for dynamic content:
```jsx
t('welcome', { name: userName })
```

---

## Troubleshooting

### Issue: Translation key not showing (shows "key" instead of translated text)

**Solutions:**
1. Check the key exists in **all** language files
2. Check spelling - keys are case-sensitive
3. Restart dev server: `npm run dev`

### Issue: Language doesn't change

**Solutions:**
1. Ensure `i18n.js` is imported in `main.jsx`
2. Check browser console for errors
3. Clear localStorage: `localStorage.clear()`
4. Restart dev server

### Issue: See "[object Object]" or translations are weird

**Solutions:**
1. Check JSON syntax in translation files
2. Use 4-space indentation for consistency
3. Verify no circular references

### Issue: Special characters not displaying

**Solutions:**
1. Ensure file is saved as UTF-8
2. Check JSON escape characters: `\"` for quotes
3. Use proper Unicode characters for scripts

---

## Performance Tips

1. **Lazy Load Large Translation Files**
   - Split translations by feature
   - Load only needed namespaces

2. **Cache Translations**
   - i18next handles localStorage automatically
   - Language preference is saved

3. **Minimize Bundle Size**
   - Keep translation files concise
   - Remove unused translations

---

## Migration from Old Translation System

If migrating from Lingo.dev API translation:

1. ✅ Translation files are ready
2. ✅ i18n configuration is complete
3. ✅ LanguageSwitcher updated to use i18n
4. ✅ No environment variables needed
5. ⏳ Update your page components to use `useTranslation` hook

**Next Step:** Wrap your page content with translation keys!

---

## Complete Example: Dashboard Component

```jsx
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t, i18n } = useTranslation();

  return (
    <div className="dashboard">
      <h1>{t('dashboard.title')}</h1>
      
      <div className="welcome-section">
        <p>{t('dashboard.welcome')}</p>
      </div>

      <div className="stats">
        <div className="card">
          <h3>{t('dashboard.totalFields')}</h3>
          <p>5</p>
        </div>
        
        <div className="card">
          <h3>{t('dashboard.activeAlerts')}</h3>
          <p>2</p>
        </div>
        
        <div className="card">
          <h3>{t('dashboard.upcomingTasks')}</h3>
          <p>3</p>
        </div>
      </div>

      <p>
        {t('common.appName')} - {t('common', { returnObjects: true }).language}
      </p>
    </div>
  );
}

export default Dashboard;
```

---

## Environment Configuration

No API key needed! The `.env.example` has been updated to reflect this.

### Optional: For Backend Language-Specific API Calls

If your backend needs to know the user's language:

```jsx
function MyComponent() {
  const { i18n } = useTranslation();

  const fetchDataInUserLanguage = async () => {
    const response = await fetch('/api/data', {
      headers: {
        'Accept-Language': i18n.language
      }
    });
    return response.json();
  };

  // Use in useEffect, event handlers, etc.
}
```

---

## Resources

- **i18next Docs:** https://www.i18next.com
- **React-i18next Docs:** https://react.i18next.com
- **Devanagari Script:** https://en.wikipedia.org/wiki/Devanagari

---

## Summary

Your app now has professional internationalization with:

✅ 4 languages (English, Marathi, Gujarati, Tamil)  
✅ Local translation files (no API needed)  
✅ Instant language switching  
✅ Easy to add more languages  
✅ React hooks for easy integration  
✅ Automatic language detection  
✅ Language preference persistence  

**Start using it:** Import `useTranslation` in your components and replace hardcoded strings with `t()` calls!
