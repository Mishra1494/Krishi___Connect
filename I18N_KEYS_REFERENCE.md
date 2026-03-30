# 📋 i18n Translation Keys Reference

This is a complete reference of all available translation keys in the system.

## Quick Lookup

### Common Keys
- `common.appName` - "Krishi Connect"
- `common.language` - "Language"
- `common.english` - "English"
- `common.marathi` - "Marathi"
- `common.gujarati` - "Gujarati"
- `common.tamil` - "Tamil"

### Navigation Keys
- `navigation.home` - "Home"
- `navigation.dashboard` - "Dashboard"
- `navigation.fields` - "Fields"
- `navigation.climate` - "Climate"
- `navigation.crops` - "Crops"
- `navigation.financial_aid` - "Financial Aid"
- `navigation.irrigation` - "Irrigation"
- `navigation.profile` - "Profile"
- `navigation.settings` - "Settings"
- `navigation.logout` - "Logout"

### Dashboard Keys
- `dashboard.title` - "Dashboard"
- `dashboard.welcome` - "Welcome to Krishi Connect"
- `dashboard.overview` - "Overview"
- `dashboard.totalFields` - "Total Fields"
- `dashboard.activeAlerts` - "Active Alerts"
- `dashboard.upcomingTasks` - "Upcoming Tasks"

### Fields Keys
- `fields.title` - "My Fields"
- `fields.addField` - "Add Field"
- `fields.fieldName` - "Field Name"
- `fields.location` - "Location"
- `fields.area` - "Area"
- `fields.created` - "Created"
- `fields.actions` - "Actions"
- `fields.viewDetails` - "View Details"
- `fields.edit` - "Edit"
- `fields.delete` - "Delete"

### Climate Keys
- `climate.title` - "Climate Analysis"
- `climate.weatherForecast` - "Weather Forecast"
- `climate.temperature` - "Temperature"
- `climate.humidity` - "Humidity"
- `climate.rainfall` - "Rainfall"
- `climate.windSpeed` - "Wind Speed"
- `climate.alerts` - "Weather Alerts"

### Crops Keys
- `crops.title` - "Crop Management"
- `crops.cropPlanning` - "Crop Planning"
- `crops.cropHealth` - "Crop Health"
- `crops.cropType` - "Crop Type"
- `crops.plantingDate` - "Planting Date"
- `crops.expectedHarvest` - "Expected Harvest"
- `crops.health` - "Health Status"

### Financial Aid Keys
- `financialAid.title` - "Financial Aid"
- `financialAid.schemes` - "Government Schemes"
- `financialAid.eligibility` - "Check Eligibility"
- `financialAid.apply` - "Apply Now"
- `financialAid.status` - "Application Status"

### Irrigation Keys
- `irrigation.title` - "Irrigation Management"
- `irrigation.waterUsage` - "Water Usage"
- `irrigation.scheduleIrrigation` - "Schedule Irrigation"
- `irrigation.waterLevel` - "Water Level"
- `irrigation.nextSchedule` - "Next Schedule"

### Common Actions Keys
- `common_actions.save` - "Save"
- `common_actions.cancel` - "Cancel"
- `common_actions.delete` - "Delete"
- `common_actions.edit` - "Edit"
- `common_actions.add` - "Add"
- `common_actions.submit` - "Submit"
- `common_actions.apply` - "Apply"
- `common_actions.search` - "Search"
- `common_actions.filter` - "Filter"
- `common_actions.export` - "Export"
- `common_actions.import` - "Import"

### Error Keys
- `errors.loading` - "Loading..."
- `errors.error` - "Error"
- `errors.notFound` - "Not Found"
- `errors.unauthorized` - "Unauthorized"
- `errors.forbidden` - "Forbidden"
- `errors.serverError` - "Server Error"
- `errors.tryAgain` - "Try Again"

### Footer Keys
- `footer.about` - "About"
- `footer.research` - "Research"
- `footer.contact` - "Contact"
- `footer.privacy` - "Privacy Policy"
- `footer.terms` - "Terms of Service"
- `footer.copyright` - "© 2024 Krishi Connect. All rights reserved."

---

## Translation Files Location

All translation files are in: `client/src/i18n/locales/`

```
locales/
├── en/common.json    (English)
├── mr/common.json    (Marathi - मराठी)
├── gu/common.json    (Gujarati - ગુજરાતી)
└── ta/common.json    (Tamil - தமிழ්)
```

---

## How to Use in Components

### Basic Usage
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('dashboard.title')}</h1>;
}
```

### Getting the Current Language
```jsx
const { i18n } = useTranslation();
console.log(i18n.language); // 'en', 'mr', 'gu', or 'ta'
```

### Changing Language
```jsx
const { i18n } = useTranslation();
i18n.changeLanguage('mr'); // Change to Marathi
```

---

## Adding New Keys

### Step 1
Add to `client/src/i18n/locales/en/common.json`:
```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "Feature description"
  }
}
```

### Step 2
Add to `client/src/i18n/locales/mr/common.json`:
```json
{
  "myFeature": {
    "title": "माझे वैशिष्ट्य शीर्षक",
    "description": "वैशिष्ट्याचे वर्णन"
  }
}
```

### Step 3
Add to `client/src/i18n/locales/gu/common.json`:
```json
{
  "myFeature": {
    "title": "મારી સુવિધાનું શીર્ષક",
    "description": "ફીચર વર્ણન"
  }
}
```

### Step 4
Add to `client/src/i18n/locales/ta/common.json`:
```json
{
  "myFeature": {
    "title": "எனது அம்சம் பேரwordை",
    "description": "அம்ச விளக்கம்"
  }
}
```

### Step 5
Use in component:
```jsx
const { t } = useTranslation();
<h1>{t('myFeature.title')}</h1>
<p>{t('myFeature.description')}</p>
```

---

## Script Types Reference

### Marathi (मराठी)
- **Script:** Devanagari
- **Direction:** Left to Right (LTR)
- **File:** `locales/mr/common.json`
- **Example:** मराठी, शेत, पिके

### Gujarati (ગુજરાતી)
- **Script:** Gujarati (Devanagari variant)
- **Direction:** Left to Right (LTR)
- **File:** `locales/gu/common.json`
- **Example:** ગુજરાતી, ખેત, પાકો

### Tamil (தமிழ்)
- **Script:** Tamil
- **Direction:** Left to Right (LTR)
- **File:** `locales/ta/common.json`
- **Example:** தமிழ், வயல், பயிர்கள்

---

## Frequently Used Key Combinations

### For Forms
```javascript
t('common_actions.save')
t('common_actions.cancel')
t('common_actions.submit')
```

### For Pages
```javascript
t('dashboard.title')
t('fields.title')
t('crops.title')
t('climate.title')
```

### For Navigation
```javascript
t('navigation.home')
t('navigation.dashboard')
t('navigation.fields')
```

### For Errors
```javascript
t('errors.loading')
t('errors.error')
t('errors.notFound')
```

---

## Updating Translations

To update a translation without adding new keys:

1. Open the relevant file: `client/src/i18n/locales/[lang]/common.json`
2. Find the key
3. Update the value
4. Save and restart dev server

Example - Update English welcome message:
```json
{
  "dashboard": {
    "welcome": "Welcome to the updated Krishi Connect!"
  }
}
```

---

## Notes

- All keys should be present in all 4 language files
- Use `.` to separate nested keys: `category.subCategory.key`
- Keys are case-sensitive
- Values can contain HTML entities but not JSX
- Translations are loaded at startup and cached in localStorage

---

## Need Help?

See `I18N_COMPLETE_GUIDE.md` for detailed documentation and examples.
