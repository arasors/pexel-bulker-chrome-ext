# Changelog

All notable changes to PexelBulker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-01-19

### 🎨 Added - UX Improvements

#### New Features
- **Open in New Tab Button**
  - Icon button in header (⤢)
  - Opens extension in full tab view
  - More space for viewing history and logs
  - Tooltip in all 5 languages
  - Properly centered when opened in new tab
  
- **Auto-scroll on Open**
  - Extension automatically scrolls to bottom on load
  - Makes "Detect URL" button immediately visible
  - Smooth scroll animation (300ms delay)
  - Better first-time user experience

#### Problem Solved
- Users no longer need to scroll to find detect URL button
- Full tab view available for better visibility
- Extension properly centered when opened in tab (not stuck in corner)
- Improved accessibility

#### Technical
- New `openInNewTab()` function
- Auto-scroll with smooth behavior
- Title translations support added
- Flexbox centering for tab view
- Container has fixed width (450px) with rounded corners and shadow

---

## [1.3.0] - 2026-01-19

### 🎯 Added - Download History & Better Controls

#### New Features
- **Download History Management**
  - View past downloads (completed and cancelled)
  - Resume cancelled downloads from where they left off
  - Delete history items
  - Auto-cleanup after 7 days
  - Max 20 history items
  - Time ago display (e.g., "2h ago", "3d ago")
  
- **Improved Control Buttons**
  - Pause/Cancel buttons now visible during scanning phase
  - Fixed issue where buttons appeared only during download
  - Buttons always visible when any process is active
  - Better state management

#### UI Improvements
- New "Download History" section at bottom of popup
- Collapsible history list (Show/Hide button)
- Each history item shows:
  - Status (Completed/Cancelled)
  - Time ago
  - Page range
  - Quality
  - Progress percentage
  - Resume and Delete buttons
- All 5 languages supported

#### Problem Solved
- Users can now pause/cancel during the scanning phase
- Resume interrupted downloads without starting over
- Track download history for reference

#### Technical
- History stored in `chrome.storage.local`
- Auto-cleanup of entries older than 7 days
- Resume functionality restores all settings
- History items include full download state

---

## [1.2.0] - 2026-01-19

### 🎯 Added - Custom Download Folder

#### New Features
- **Customizable Download Folder**
  - Users can now choose their own folder name
  - Files saved to Downloads/[custom-folder]/
  - Folder name persists across sessions
  - "Change" button to update folder anytime
  - Sanitizes folder name (removes invalid characters)
  
- **UI Improvements**
  - New "Download Folder" section in settings
  - Info tooltip showing save location
  - Folder name displayed before download starts
  - All 5 languages supported

#### Problem Solved
- Fixed issue with Chrome's "Ask where to save each file" setting
- Bulk downloads now work even if browser asks for location
- Extension always uses specified folder (no dialogs)
- Prevents download interruptions

#### Technical
- Folder preference saved in `chrome.storage.local`
- Folder name passed to background script
- State persistence includes folder info
- Invalid characters automatically replaced with `-`

### Changed
- Version bumped to 1.2.0
- Form sections now include folder selector
- Hide/show logic updated for new section

---

## [1.1.1] - 2026-01-19

### 🐛 Fixed - Detect URL Button

#### Bug Fixes
- Fixed "Detect URL" button not working
- DOM elements now properly initialized in DOMContentLoaded
- Added null checks for all DOM elements
- Added translations loading verification
- Added debug console logs

#### Technical
- Event listeners added after DOM ready
- Safety checks for undefined translations
- Better error messages for debugging

---

## [1.1.0] - 2026-01-19

### 🌍 Added - Multi-Language Support!

#### New Features
- **5 Languages Support**
  - 🇬🇧 English
  - 🇹🇷 Turkish (Türkçe)
  - 🇪🇸 Spanish (Español)
  - 🇫🇷 French (Français)
  - 🇨🇳 Chinese (中文)

- **Language Selector**
  - Dropdown in extension popup (top-right)
  - Instant language switching
  - Automatic browser language detection
  - Persistent language preference

- **Fully Translated**
  - All UI elements (52 translation keys)
  - Button labels and tooltips
  - Log messages and notifications
  - Error messages and confirmations
  - Progress indicators
  - Input placeholders

#### Technical
- New `translations.js` with all language strings
- Dynamic translation system with `data-i18n` attributes
- Language preference saved in `chrome.storage.local`
- Support for variable replacement in messages (e.g., `{userId}`, `{pages}`)

#### Documentation
- New `MULTILANGUAGE.md` - Complete multi-language guide
- Translation guidelines for contributors
- Instructions for adding new languages

### Changed
- Manifest version bumped to 1.1.0
- Description updated to mention multi-language support
- README updated with language information

---

## [1.0.0] - 2026-01-19

### 🎉 Initial Release

#### Added
- **Bulk Download Functionality**
  - Download multiple videos from Pexels user pages
  - Automatic page scanning and pagination handling
  - Support for up to 80 videos per page scan

- **Quality Selection**
  - UHD (4K) quality option
  - HD (1080p/720p) quality option
  - SD (Standard definition) quality option
  - Auto mode - automatically selects best available quality

- **Progress Tracking**
  - Real-time progress bar
  - Page scan counter
  - Video download counter
  - Detailed activity log with timestamps
  - Color-coded log messages (info/success/error)

- **Download Controls**
  - Pause downloads
  - Resume downloads from last position
  - Cancel entire download process
  - Confirmation dialog for cancellation

- **State Persistence**
  - Download state saved to Chrome storage
  - Continue downloads even after closing popup
  - Restore progress on popup reopen
  - Maintain queue and download position

- **User Interface**
  - Clean, modern gradient design
  - Responsive layout
  - Intuitive controls
  - Page range selection
  - "All pages" quick option
  - Clear log button

- **Smart Features**
  - Automatic URL detection from Pexels pages
  - User ID extraction from page
  - API URL construction
  - Locale detection (supports all Pexels locales)
  - Duplicate filename handling

- **API Protection**
  - Rate limiting (500ms between page scans)
  - Download delay (1000ms between downloads)
  - Proper error handling
  - Chrome download API integration

- **Security**
  - Uses Pexels cookies for authentication
  - Proper headers for API requests
  - Secret-key authentication
  - CORS-compliant requests

#### Technical
- Manifest V3 implementation
- Service Worker background script
- Content script for page interaction
- Chrome storage for state persistence
- Modern async/await patterns
- Modular code structure

#### Documentation
- Comprehensive README (English)
- Turkish README (README_TR.md)
- Installation guide (KURULUM.md)
- Quick start guide (HIZLI-BASLANGIC.md)
- Feature documentation (OZELLIKLER.md)
- Project summary (PROJE-OZETI.md)
- Chrome Store description
- Privacy policy
- This changelog

#### Assets
- Extension icons (16px, 48px, 128px)
- Icon generator tool (generate-icons.html)
- Packaging script (package-extension.sh)
- MIT License

---

## [Unreleased]

### Planned Features for Future Releases

#### v1.1.0 (Next)
- Photo download support
- Download speed indicator
- Estimated time remaining
- Download history view
- Export download list (JSON/CSV)

#### v1.2.0
- Playlist/Collection support
- Favorite users management
- Scheduled downloads
- Custom download location
- Filename templates

#### v1.3.0
- Video preview before download
- Thumbnail generation
- Duplicate detection
- Bulk rename tools
- Statistics dashboard

#### v2.0.0
- Multi-site support (Pixabay, Unsplash)
- Cloud backup integration
- Download manager improvements
- Advanced filters
- Batch operations

---

## Version History

### Version Numbering

- **MAJOR**: Breaking changes or major new features
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes and minor improvements

### Support Policy

- Latest version always supported
- Bug fixes backported when critical
- Security updates immediate

---

## How to Update

### For Users

1. Chrome will auto-update the extension
2. Or manually: chrome://extensions/ → Update

### For Developers

```bash
# Update version in manifest.json
# Update CHANGELOG.md
# Create git tag
git tag v1.0.0
git push --tags
```

---

## Credits

### Contributors
- Initial development and release - 2026

### Special Thanks
- Pexels for providing amazing free stock videos
- Chrome Extensions team for great documentation
- All users who provide feedback

---

## License

MIT License - See LICENSE file for details

---

**Stay tuned for updates!** 🚀

For feature requests or bug reports:
- GitHub Issues: [Repository URL]
- Email: [Contact Email]
