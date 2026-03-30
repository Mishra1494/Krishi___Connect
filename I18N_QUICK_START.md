# 🚀 i18n Setup - Quick Start

## What Changed?

✅ **Old System:** Lingo.dev API (on-the-fly translation)  
✅ **New System:** i18next + Local JSON Files (pre-translated)

### Benefits

- ⚡ Instant language switching
- 📄 Local translation files (no API needed)
- 🔐 No API keys required
- 💾 Translations stored in `src/i18n/locales/`
- 🎨 Easy to customize and maintain
- 🌍 Support for unlimited languages

---

## 3-Step Setup

### Step 1: Install Dependencies

```bash
cd client
npm install
```

✅ i18next, react-i18next, and related packages are already in package.json

### Step 2: Start the App

```bash
npm run dev
```

The app is ready! No environment variables needed.

### Step 3: Test the Feature

1. Open app in browser
2. Click the language button (top-right, globe icon 🌐)
3. Select a language (मराठी, ગુજરાતી, தமிழ்)
4. Page changes language instantly!

---

## Translation Files

All translations stored locally:

```
client/src/i18n/locales/
├── en/common.json     ← English
├── mr/common.json     ← Marathi (मराठी)
├── gu/common.json     ← Gujarati (ગુજરાતી)
└── ta/common.json     ← Tamil (தமிழ்)
```

---

## Using Translations in Components

### Simple Example

```jsx
import { useTranslation } from 'react-i18next';

function MyPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
      <button>{t('common_actions.save')}</button>
    </div>
  );
}
```

### Get Current Language

```jsx
const { i18n } = useTranslation();

console.log(i18n.language); // 'en', 'mr', 'gu', or 'ta'
```

### Change Language Programmatically

```jsx
const { i18n } = useTranslation();

const switchToMarathi = () => {
  i18n.changeLanguage('mr');
};
```

---

## Files Created

| File | Purpose |
|------|---------|
| `src/i18n/i18n.js` | i18n configuration |
| `src/i18n/locales/en/common.json` | English translations |
| `src/i18n/locales/mr/common.json` | Marathi translations |
| `src/i18n/locales/gu/common.json` | Gujarati translations |
| `src/i18n/locales/ta/common.json` | Tamil translations |

## Files Modified

| File | Change |
|------|--------|
| `src/main.jsx` | Added i18n import |
| `src/App.jsx` | Removed LanguageProvider (i18n handles it) |
| `src/components/common/LanguageSwitcher.jsx` | Updated to use i18n |
| `package.json` | Added i18n dependencies |

---

## Key Translation Examples

### Dashboard
```javascript
t('dashboard.title')       // "Dashboard"
t('dashboard.welcome')     // "Welcome to Krishi Connect"
t('dashboard.totalFields') // "Total Fields"
```

### Navigation
```javascript
t('navigation.home')       // "Home"
t('navigation.fields')     // "Fields"
t('navigation.crops')      // "Crops"
```

### Actions
```javascript
t('common_actions.save')   // "Save"
t('common_actions.cancel') // "Cancel"
t('common_actions.submit') // "Submit"
```

---

## Adding New Translations

### Quick Example: Add "Harvest" translations

#### 1. English (`client/src/i18n/locales/en/common.json`)
```json
{
  "crops": {
    "harvest": "Harvest"
  }
}
```

#### 2. Marathi (`client/src/i18n/locales/mr/common.json`)
```json
{
  "crops": {
    "harvest": "कापणी"
  }
}
```

#### 3. Gujarati (`client/src/i18n/locales/gu/common.json`)
```json
{
  "crops": {
    "harvest": "લણણી"
  }
}
```

#### 4. Tamil (`client/src/i18n/locales/ta/common.json`)
```json
{
  "crops": {
    "harvest": "அறுவடை"
  }
}
```

#### 5. Use in component
```jsx
<h2>{t('crops.harvest')}</h2>
```

---

## Language Codes

| Language | Code | Script | File |
|----------|------|--------|------|
| English | `en` | Latin | `en/common.json` |
| Marathi | `mr` | Devanagari | `mr/common.json` |
| Gujarati | `gu` | Gujarati | `gu/common.json` |
| Tamil | `ta` | Tamil | `ta/common.json` |

---

## Available Keys by Category

### Common
```
common.appName
common.language
common.english
common.marathi
common.gujarati
common.tamil
```

### Navigation
```
navigation.home
navigation.dashboard
navigation.fields
navigation.climate
navigation.crops
navigation.financial_aid
navigation.irrigation
navigation.profile
navigation.settings
navigation.logout
```

### Dashboard
```
dashboard.title
dashboard.welcome
dashboard.overview
dashboard.totalFields
dashboard.activeAlerts
dashboard.upcomingTasks
```

### And many more...

**See `I18N_KEYS_REFERENCE.md` for complete list of all available keys.**

---

## Common Tasks

### Replace Hardcoded String

❌ Before:
```jsx
<h1>My Fields</h1>
```

✅ After:
```jsx
import { useTranslation } from 'react-i18next';

function Fields() {
  const { t } = useTranslation();
  return <h1>{t('fields.title')}</h1>;
}
```

### Show Language-Specific Content

```jsx
import { useTranslation } from 'react-i18next';

function LocalizedFeature() {
  const { i18n } = useTranslation();

  if (i18n.language === 'mr') {
    return <MarathiUI />;
  } else if (i18n.language === 'gu') {
    return <GujaratiUI />;
  }
  return <EnglishUI />;
}
```

### Add Dynamic Content to Translation

```jsx
import { useTranslation } from 'react-i18next';

function Greeting({ userName }) {
  const { t } = useTranslation();
  
  // Translation key: "welcome_message": "Hello, {{name}}!"
  return <h1>{t('welcome_message', { name: userName })}</h1>;
}
```

---

## Troubleshooting

### Issue: I see `dashboard.title` instead of "Dashboard"

**Solution:**
1. Make sure key exists in translation file
2. Check spelling and case sensitivity
3. Restart dev server: `npm run dev`

### Issue: Language doesn't change

**Solution:**
1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Refresh the page
4. Restart dev server

### Issue: Some text not translating

**Solution:**
1. Make sure you're using `t()` for all strings
2. Check if key is in translation file
3. Check if LanguageSwitcher is properly integrated

---

## What NOT to Do

❌ Don't hardcode strings:
```jsx
<h1>My Dashboard</h1> // ❌ Bad!
```

❌ Don't forget to add to all language files:
```json
// ❌ Only in English file
{"myKey": "Value"}
// ✅ Must be in en, mr, gu, ta files
```

❌ Don't use dynamic keys:
```jsx
t(`color.${myVariable}`) // ❌ Bad for bundling
```

---

## Next Steps

1. ✅ Run `npm install` to ensure dependencies
2. ✅ Run `npm run dev` to start the app
3. ✅ Test language switcher
4. ✅ Replace hardcoded strings with `t()` calls
5. ✅ Add missing translations as needed
6. ✅ Deploy when ready!

---

## Documentation

- **Complete Guide:** `I18N_COMPLETE_GUIDE.md`
- **Keys Reference:** `I18N_KEYS_REFERENCE.md`
- **This Quick Start:** You're reading it!

---

## Need More Languages?

To add Hindi, Chinese, Spanish, or any other language:

1. Create `client/src/i18n/locales/[code]/common.json`
2. Add all translation keys
3. Update `client/src/i18n/i18n.js` to import and register
4. Done! It will appear in language selector automatically.

---

## Success! 🎉

Your app now has professional multi-language support with:

✅ 4 languages (English, Marathi, Gujarati, Tamil)  
✅ Local translation files  
✅ Instant language switching  
✅ Easy to maintain  
✅ Easy to extend  

**Happy translating!** 🌍
