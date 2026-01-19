# 🌍 PexelBulker - Multi-Language Support

PexelBulker now supports **5 languages** with easy switching between them!

## Supported Languages

| Language | Code | Status |
|----------|------|--------|
| 🇬🇧 English | `en` | ✅ Complete |
| 🇹🇷 Turkish | `tr` | ✅ Complete |
| 🇪🇸 Spanish | `es` | ✅ Complete |
| 🇫🇷 French | `fr` | ✅ Complete |
| 🇨🇳 Chinese | `zh` | ✅ Complete |

## How to Change Language

### In the Extension

1. Click the PexelBulker icon in Chrome toolbar
2. Look at the top-right corner of the popup
3. Select your preferred language from the dropdown
4. The interface will update instantly!

### Language Detection

- **First time**: Extension detects your browser language automatically
- **Saved preference**: Your language choice is remembered
- **Manual override**: Change language anytime from the dropdown

## What's Translated

✅ All UI elements
✅ Button labels
✅ Input placeholders
✅ Log messages
✅ Progress indicators
✅ Error messages
✅ Success notifications
✅ Confirmation dialogs

## Adding a New Language

Want to add your language? It's easy!

### 1. Edit translations.js

Add your language object to the `translations` object:

```javascript
translations.{languageCode} = {
  // Header
  title: "PexelBulker",
  subtitle: "Your translation here",
  
  // ... copy all keys from 'en' and translate
};
```

### 2. Add to Language Selector

In `popup.html`, add your language option:

```html
<select id="langSelect" class="lang-select">
  <option value="en">English</option>
  <option value="tr">Türkçe</option>
  <option value="es">Español</option>
  <option value="fr">Français</option>
  <option value="zh">中文</option>
  <option value="YOUR_CODE">Your Language</option>
</select>
```

### 3. Test

1. Reload the extension
2. Select your new language
3. Check all UI elements are translated
4. Test log messages and dynamic content

## Translation Keys

Total translation keys: **52**

### Categories

- **UI Elements**: 15 keys
  - title, subtitle, buttons, labels
  
- **Quality Options**: 4 keys
  - UHD, HD, SD, All
  
- **Progress**: 4 keys
  - Preparing, Paused, Cancelled, Completed
  
- **Log Messages**: 19 keys
  - Info, success, error messages
  
- **Actions**: 10 keys
  - Button states, confirmations

## Technical Details

### Storage

- Language preference: `chrome.storage.local`
- Key: `language`
- Persists across sessions

### Implementation

```javascript
// Load language
chrome.storage.local.get(['language'], (result) => {
  currentLang = result.language || detectBrowserLang();
});

// Save language
chrome.storage.local.set({ language: 'en' });

// Apply translations
document.querySelectorAll('[data-i18n]').forEach(el => {
  el.textContent = translations[lang][key];
});
```

### Dynamic Content

Log messages with variables:

```javascript
// Template
logUserIdFound: "User ID: {userId}"

// Usage
addLog(translations[lang].logUserIdFound.replace('{userId}', '123'));
```

## Translation Guidelines

### 1. Keep it concise
- UI space is limited
- Button text should be short
- Use abbreviations when appropriate

### 2. Maintain context
- Understand the feature before translating
- Test translations in the actual UI
- Consider cultural differences

### 3. Technical terms
- Keep technical terms in English when appropriate
- "API", "URL", "UHD", "HD", "SD" usually stay the same
- Explain if necessary

### 4. Consistency
- Use same terminology throughout
- Match tone of other languages
- Professional and friendly

### 5. Variables
- Keep placeholder variables unchanged: `{userId}`, `{pages}`, `{videos}`
- Ensure they're in correct grammatical position

## Quality Assurance

### Testing Checklist

- [ ] All UI elements display correctly
- [ ] No text overflow or truncation
- [ ] Buttons have appropriate spacing
- [ ] Log messages are clear and helpful
- [ ] Error messages are understandable
- [ ] Variable replacements work correctly
- [ ] Language persists after reload
- [ ] Language changes instantly
- [ ] All features work in all languages

### Common Issues

**Text too long?**
- Use abbreviations
- Rephrase more concisely
- Adjust CSS if needed

**Variables not showing?**
- Check placeholder syntax: `{variableName}`
- Verify .replace() calls in code

**Language not saving?**
- Check chrome.storage permissions
- Verify storage.local calls

## Language Statistics

### Character Counts (Average)

| Element Type | EN | TR | ES | FR | ZH |
|--------------|----|----|----|----|-----|
| Button Text  | 12 | 14 | 15 | 14 | 6  |
| Log Messages | 45 | 52 | 50 | 48 | 25 |
| Labels       | 10 | 12 | 13 | 12 | 5  |

### Translation Completeness

```
✅ English:  52/52 (100%)
✅ Turkish:  52/52 (100%)
✅ Spanish:  52/52 (100%)
✅ French:   52/52 (100%)
✅ Chinese:  52/52 (100%)
```

## Contributing Translations

### Submit a Translation

1. Fork the repository
2. Add your language to `translations.js`
3. Add language option to `popup.html`
4. Test thoroughly
5. Submit a pull request

### Translation Review

Translations are reviewed for:
- Accuracy
- Completeness
- Cultural appropriateness
- Technical correctness
- UI compatibility

## Future Languages

Planned additions:
- 🇩🇪 German (de)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇷🇺 Russian (ru)
- 🇮🇹 Italian (it)
- 🇵🇹 Portuguese (pt)
- 🇳🇱 Dutch (nl)
- 🇸🇪 Swedish (sv)

Want to help? Open an issue!

## Credits

### Translators

- 🇬🇧 English: Original
- 🇹🇷 Turkish: Native speaker verified
- 🇪🇸 Spanish: Translation provided
- 🇫🇷 French: Translation provided
- 🇨🇳 Chinese: Translation provided

Thank you to all contributors!

## Support

### Reporting Translation Issues

Found a translation error?

1. Open GitHub Issue
2. Specify:
   - Language
   - Location (which screen/message)
   - Current text
   - Suggested correction
   - Context/explanation

### Request a Language

Want PexelBulker in your language?

1. Open GitHub Issue with title: "Language Request: [Language Name]"
2. Include:
   - Language code (ISO 639-1)
   - Number of potential users
   - Your willingness to help translate

---

**Making PexelBulker accessible to everyone, everywhere!** 🌍

*Last updated: January 2026*
