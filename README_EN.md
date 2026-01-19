# 🎬 PexelBulker

Bulk video downloader Chrome extension for Pexels.

## Features

✅ Bulk download all videos from Pexels user pages  
✅ Automatic page scanning and pagination management  
✅ Quality options (UHD, HD, SD)  
✅ Page range selection  
✅ Progress tracking with detailed logs  
✅ Secure downloads with Pexels cookies and headers  
✅ API protection with rate limiting  
✅ Pause/Resume/Cancel controls  
✅ State persistence (works even if popup is closed)  

## Installation

### 1. Enable Developer Mode in Chrome

1. Go to `chrome://extensions/` in Chrome
2. Turn on "Developer mode" in the top right corner

### 2. Load the Extension

1. Click "Load unpacked" button
2. Select the `PexelBulker` folder
3. Extension installed!

### 3. Add Icons (Optional)

The extension will work, but to see icons, add PNG files in these sizes to the `icons` folder:
- `icon16.png` (16x16 px)
- `icon48.png` (48x48 px)
- `icon128.png` (128x128 px)

Or simply open `generate-icons.html` in your browser and download the generated icons.

## Usage

1. **Go to a Pexels User Page**
   - Example: `https://www.pexels.com/en-us/@cottonbro/videos/`
   - Must be on a user's video page

2. **Open the Extension**
   - Click the PexelBulker icon in Chrome toolbar

3. **Detect URL**
   - Click "Detect URL" button
   - Extension will automatically find the API URL and fetch page info

4. **Configure Settings**
   - **Select Quality**: UHD, HD, SD, or All (Best Available)
   - **Page Range**: All pages or specific range
   
5. **Start Download**
   - Click "Scan & Download" button
   - Videos will be saved to `Downloads/PexelBulker/` folder

## Controls

### During Download

- **⏸ Pause** - Pause the download process
- **▶ Resume** - Resume from where it left off
- **✕ Cancel** - Cancel the entire process

### State Persistence

- Close the popup anytime - your download will continue
- Reopen the popup to see progress
- All state is saved and restored automatically

## Quality Options

- **UHD**: Highest quality (4K - 3840×2160 and higher)
- **HD**: High definition (1080p/720p)
- **SD**: Standard definition (480p and lower)
- **All**: Automatically selects the best available quality

## Features in Detail

### Page Management

- Total page count is automatically detected
- Scan any page range you want
- Up to 80 videos scanned per page

### Download Management

- Videos are automatically downloaded sequentially
- Filenames: `pexels-[ID]-[quality]-[width]x[height].mp4`
- Duplicate filenames are automatically made unique
- Rate limiting protects Pexels API

### Progress Tracking

- Real-time progress bar
- Detailed activity log with timestamps
- Scanned pages counter
- Downloaded videos counter

## Technical Details

### Requirements

- Chrome Browser v88+
- Manifest V3 support

### Permissions

- `downloads`: For downloading videos
- `storage`: For saving settings and state
- `cookies`: For reading Pexels cookies
- `activeTab`: For interacting with the active tab
- `tabs`: For tab management
- `host_permissions`: For accessing Pexels domains

### File Structure

```
PexelBulker/
├── manifest.json          # Extension manifest
├── popup.html            # Main UI
├── popup.js              # Popup logic
├── content.js            # Page interaction script
├── background.js         # Background service worker
├── styles.css            # CSS styles
├── icons/                # Extension icons
└── generate-icons.html   # Icon generator tool
```

## Troubleshooting

### "URL detection failed"
- Make sure you're on a Pexels user page
- Refresh the page and try again
- Check Developer Console for error messages

### "API call failed"
- Check your internet connection
- Make sure you're logged into Pexels
- If using VPN, try disabling it

### Downloads not starting
- Check Chrome download permissions
- Make sure you have enough disk space
- Check `chrome://downloads/` for blocked downloads

### Rate Limiting / Too many requests error
- Extension automatically adds delays between requests
- If scanning too many pages, reduce the page range
- Wait a while and try again

## Development

### Debug Mode

1. Go to `chrome://extensions/`
2. Find PexelBulker
3. Click "Inspect views: service worker"
4. Check console for log messages

### Test

1. Test user: `@cottonbro`
2. Test URL: `https://www.pexels.com/en-us/@cottonbro/videos/`

## License

This project is for educational purposes. Use in accordance with Pexels' terms of service.

## Warnings

⚠️ **Important**: 
- This extension is not an official Pexels product
- Do not exceed Pexels API usage limits
- Use downloaded content according to Pexels license terms
- Read Pexels license terms for commercial use

## Performance Tips

### For Large Collections:
- Select "HD" or "SD" quality (faster)
- Limit page range to 50-100
- Download in multiple sessions

### For Best Performance:
- Pause other downloads
- Close other tabs
- Ensure stable internet connection

## Disk Space Requirements

```
UHD:  ~200 MB/video  →  100 videos = ~20 GB
HD:   ~50 MB/video   →  100 videos = ~5 GB
SD:   ~10 MB/video   →  100 videos = ~1 GB
```

## Support

For issues or suggestions:
- Open GitHub Issues
- Include error messages and screenshots
- Specify Chrome version
- Specify operating system

---

**Made with ❤️ for efficient Pexels downloading**

*Version 1.0.0 | 2026*
