# 🔄 i18n Migration Guide

## Updating Components to Use i18n

This guide shows how to convert your existing components from hardcoded strings to i18n translations.

---

## Quick Reference

### Before (Hardcoded)
```jsx
<h1>Dashboard</h1>
<p>Welcome to Krishi Connect</p>
<button>Save</button>
```

### After (With i18n)
```jsx
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
      <button>{t('common_actions.save')}</button>
    </>
  );
}
```

---

## Step-by-Step Migration

### Step 1: Import useTranslation

Add this at the top of your component:

```jsx
import { useTranslation } from 'react-i18next';
```

### Step 2: Get t Function

Inside your component function:

```jsx
function MyComponent() {
  const { t } = useTranslation();
  
  // Now you can use t() to get translations
}
```

### Step 3: Replace Strings

Convert all hardcoded strings to use `t()`:

```jsx
// ❌ Before
<h1>My Fields</h1>
<button>Add Field</button>

// ✅ After
<h1>{t('fields.title')}</h1>
<button>{t('fields.addField')}</button>
```

### Step 4: Find the Right Key

Look up your key in `I18N_KEYS_REFERENCE.md`:

- Navigation items: `navigation.*`
- Buttons/Actions: `common_actions.*`
- Page titles: Use page name (e.g., `fields.title`)
- Error messages: `errors.*`

---

## Common Patterns

### Pattern 1: Page Component

```jsx
// ❌ Before
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to Krishi Connect</p>
      <div>
        <h2>Overview</h2>
        <h2>Total Fields</h2>
        <h2>Active Alerts</h2>
      </div>
    </div>
  );
}

// ✅ After
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
      <div>
        <h2>{t('dashboard.overview')}</h2>
        <h2>{t('dashboard.totalFields')}</h2>
        <h2>{t('dashboard.activeAlerts')}</h2>
      </div>
    </div>
  );
}
```

### Pattern 2: Form with Buttons

```jsx
// ❌ Before
function CreateFieldForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // ...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Field Name" />
      <button type="submit">Submit</button>
      <button type="button">Cancel</button>
    </form>
  );
}

// ✅ After
import { useTranslation } from 'react-i18next';

function CreateFieldForm() {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder={t('fields.fieldName')} />
      <button type="submit">{t('common_actions.submit')}</button>
      <button type="button">{t('common_actions.cancel')}</button>
    </form>
  );
}
```

### Pattern 3: Navigation Menu

```jsx
// ❌ Before
function Navbar() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/fields">Fields</a>
      <a href="/crops">Crops</a>
      <a href="/climate">Climate</a>
    </nav>
  );
}

// ✅ After
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav>
      <a href="/">{t('navigation.home')}</a>
      <a href="/dashboard">{t('navigation.dashboard')}</a>
      <a href="/fields">{t('navigation.fields')}</a>
      <a href="/crops">{t('navigation.crops')}</a>
      <a href="/climate">{t('navigation.climate')}</a>
    </nav>
  );
}
```

### Pattern 4: Table Headers

```jsx
// ❌ Before
function FieldsTable({ fields }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Field Name</th>
          <th>Location</th>
          <th>Area</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {fields.map(field => (
          <tr key={field.id}>
            <td>{field.name}</td>
            <td>{field.location}</td>
            <td>{field.area}</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ✅ After
import { useTranslation } from 'react-i18next';

function FieldsTable({ fields }) {
  const { t } = useTranslation();

  return (
    <table>
      <thead>
        <tr>
          <th>{t('fields.fieldName')}</th>
          <th>{t('fields.location')}</th>
          <th>{t('fields.area')}</th>
          <th>{t('fields.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {fields.map(field => (
          <tr key={field.id}>
            <td>{field.name}</td>
            <td>{field.location}</td>
            <td>{field.area}</td>
            <td>
              <button>{t('common_actions.edit')}</button>
              <button>{t('common_actions.delete')}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Pattern 5: Error Messages

```jsx
// ❌ Before
function LoadingComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Content</div>;
}

// ✅ After
import { useTranslation } from 'react-i18next';

function LoadingComponent() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) return <div>{t('errors.loading')}</div>;
  if (error) return <div>{t('errors.error')}: {error}</div>;

  return <div>Content</div>;
}
```

### Pattern 6: Dynamic Values

```jsx
// ❌ Before
function Welcome({ userName }) {
  return <h1>Hello, {userName}!</h1>;
}

// ✅ After (Option 1: Use interpolation)
import { useTranslation } from 'react-i18next';

function Welcome({ userName }) {
  const { t } = useTranslation();
  return <h1>{t('welcome', { name: userName })}</h1>;
}

// Note: Add to translation files:
// en: "welcome": "Hello, {{name}}!"
// mr: "welcome": "नमस्कार, {{name}}!"
```

### Pattern 7: Conditional Text

```jsx
// ❌ Before
function StatusBadge({ status }) {
  if (status === 'active') return <span>Active</span>;
  if (status === 'inactive') return <span>Inactive</span>;
  return <span>Unknown</span>;
}

// ✅ After
import { useTranslation } from 'react-i18next';

function StatusBadge({ status }) {
  const { t } = useTranslation();
  
  const statusMap = {
    'active': t('fields.statusActive'),
    'inactive': t('fields.statusInactive')
  };

  return <span>{statusMap[status] || t('errors.unknown')}</span>;
}
```

---

## Looking Up Translation Keys

### How to Find the Right Key

1. **Open** `I18N_KEYS_REFERENCE.md`
2. **Find** your category (dashboard, fields, crops, etc.)
3. **Use** the exact key name
4. **Example:**
   ```
   Category: dashboard
   Key: title
   Full key: dashboard.title
   ```

### Key Name Convention

- Lowercase with underscores
- Organized by feature: `feature.section.key`
- Examples:
  - `dashboard.title`
  - `fields.addField`
  - `common_actions.save`

### If Key Doesn't Exist

1. **Check** if there's a similar key
2. **Add** new key to all 4 language files
3. **See** "Adding New Keys" section

---

## Adding New Translation Keys

When a key doesn't exist, create it:

### Step 1: Add to English File

`client/src/i18n/locales/en/common.json`:
```json
{
  "myFeature": {
    "myKey": "My English Text"
  }
}
```

### Step 2: Add to Marathi

`client/src/i18n/locales/mr/common.json`:
```json
{
  "myFeature": {
    "myKey": "माझा मराठी मजकूर"
  }
}
```

### Step 3: Add to Gujarati

`client/src/i18n/locales/gu/common.json`:
```json
{
  "myFeature": {
    "myKey": "મારું ગુજરાતી પાઠ"
  }
}
```

### Step 4: Add to Tamil

`client/src/i18n/locales/ta/common.json`:
```json
{
  "myFeature": {
    "myKey": "எனது தமிழ் உரை"
  }
}
```

### Step 5: Use in Component

```jsx
const { t } = useTranslation();
<div>{t('myFeature.myKey')}</div>
```

---

## Testing Your Changes

### Test in All Languages

1. Start app: `npm run dev`
2. Click language button (🌐) in top-right
3. Select each language
4. Verify your text appears correctly
5. Check for any missing keys

### Inspect for Missing Keys

1. Open browser DevTools (F12)
2. Check Console tab
3. Should see **no warnings about missing keys**
4. If missing, add the key to all language files

---

## Before & After Examples

### Example 1: Simple Page

**Before:**
```jsx
function Fields() {
  return (
    <div>
      <h1>My Fields</h1>
      <button>Add Field</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Area</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
```

**After:**
```jsx
import { useTranslation } from 'react-i18next';

function Fields() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('fields.title')}</h1>
      <button>{t('fields.addField')}</button>
      <table>
        <thead>
          <tr>
            <th>{t('fields.fieldName')}</th>
            <th>{t('fields.location')}</th>
            <th>{t('fields.area')}</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
```

### Example 2: Form Component

**Before:**
```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}
```

**After:**
```jsx
import { useTranslation } from 'react-i18next';

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t('auth.email')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>{t('auth.password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">{t('auth.signIn')}</button>
    </form>
  );
}
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting useTranslation import

```jsx
// ❌ This will fail
function MyComponent() {
  return <h1>{t('dashboard.title')}</h1>; // t is not defined!
}

// ✅ Always import first
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('dashboard.title')}</h1>;
}
```

### ❌ Mistake 2: Using wrong key format

```jsx
const { t } = useTranslation();

// ❌ These are wrong
t('DashboardTitle')        // Key doesn't exist (case-sensitive)
t('dashboard-title')       // Should be underscore, not hyphen
t('dashboard title')       // Should use dots, not spaces

// ✅ Use exact key
t('dashboard.title')
```

### ❌ Mistake 3: Only adding to one language

```json
// ❌ Only in English file - INCOMPLETE
// en/common.json
{"myKey": "English text"}

// ✅ Add to ALL 4 files
// en/common.json
{"myKey": "English text"}
// mr/common.json
{"myKey": "मराठी पाठ"}
// gu/common.json
{"myKey": "ગુજરાતી પાઠ"}
// ta/common.json
{"myKey": "தமிழ் உரை"}
```

### ❌ Mistake 4: Hardcoding UI strings

```jsx
// ❌ Mistake - hardcoding defeats i18n
<h1>Dashboard</h1>
<button>Save</button>
<p>Loading...</p>

// ✅ Always use t()
<h1>{t('dashboard.title')}</h1>
<button>{t('common_actions.save')}</button>
<p>{t('errors.loading')}</p>
```

---

## Checklist for Migration

For each component you update:

- [ ] Import `useTranslation`
- [ ] Call `const { t } = useTranslation()`
- [ ] Replace all hardcoded strings with `t()` calls
- [ ] Use correct key names (from `I18N_KEYS_REFERENCE.md`)
- [ ] Test in all 4 languages
- [ ] No console warnings about missing keys
- [ ] Commit with descriptive message

---

## Tips & Tricks

### Tip 1: Using useTranslation in Custom Hooks

```jsx
import { useTranslation } from 'react-i18next';

export function useMyCustomHook() {
  const { t } = useTranslation();
  
  return {
    getLabel: (key) => t(key),
    // ... other logic
  };
}
```

### Tip 2: Translating Array/Object Labels

```jsx
const { t } = useTranslation();

const cropTypes = [
  { id: 1, name: t('crops.wheat') },
  { id: 2, name: t('crops.rice') },
  { id: 3, name: t('crops.sugarcane') }
];
```

### Tip 3: Using with TypeScript (Optional)

```typescript
import { useTranslation } from 'react-i18next';

function myComponent() {
  const { t, i18n } = useTranslation();
  const language: string = i18n.language;
  
  return <h1>{t('dashboard.title')}</h1>;
}
```

---

## Getting Help

1. **Can't find a key?**
   - Check `I18N_KEYS_REFERENCE.md` for all available keys
   - If not there, you may need to add it

2. **Key shows instead of translation?**
   - Missing key in one of the language files
   - Check JSON syntax
   - Restart dev server

3. **Need to add new key?**
   - Add to all 4 language files
   - Use same structure in each file
   - Use i18n-centric naming

---

## Final Checklist

Before considering the migration complete:

- ✅ All hardcoded strings replaced with `t()` calls
- ✅ All string variables use translation keys
- ✅ All buttons/labels use translations
- ✅ All error messages use error keys
- ✅ Tested in all 4 languages
- ✅ No console warnings about missing keys
- ✅ No console errors related to i18n
- ✅ Language switching works correctly
- ✅ Language preference persists on reload

---

## Next Steps

1. Choose a component to migrate
2. Follow the patterns from this guide
3. Test in all 4 languages
4. Move to next component
5. Celebrate as your app becomes multilingual! 🎉

**Happy migrating!** 🌍
