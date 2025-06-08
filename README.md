<div align="center">

<!-- Replace logo-placeholder.png with your actual logo -->
<img src="images/logo-placeholder.png" alt="QueueTube Logo" width="168" height="128">


**Instantly transform any YouTube channel into a complete playlist**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=google-chrome&logoColor=white)](https://github.com/yourusername/QueueTube)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Install Extension](#installation) • [How to Use](#how-to-use) • [Features](#features) • [Support](#troubleshooting)

</div>

---

## ✨ What QueueTube Does

QueueTube creates instant playlists from **any** YouTube channel with just one click. Unlike other tools that only grab visible videos, QueueTube uses smart discovery methods to access **ALL** channel uploads - whether there are 50 videos or 5,000.

**Core Features:**
- 🚀 **One-Click Magic**: Works from any channel page (Home, Videos, Playlists, etc.)
- 📺 **Complete Coverage**: Gets ALL videos using YouTube's native playlist system
- ⚡ **Instant Results**: No scrolling, no waiting - direct to full playlists
- 🔄 **Smart Fallbacks**: Multiple methods ensure it always works

**Coming Soon:**
- 👁️ Watch history tracking
- ⏭️ Skip watched videos
- 📊 Channel management

---

## 🛠️ Installation

### Load as Chrome Extension

1. **Download the Files**
   ```bash
   git clone https://github.com/yourusername/QueueTube.git
   cd QueueTube
   ```

2. **Install in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **"Developer mode"** (top-right toggle)
   - Click **"Load unpacked"** and select the `QueueTube` folder

3. **Add Icons (Optional)**
   - Add `icon16.png`, `icon48.png`, `icon128.png` to the `images/` folder
   - See `images/create_icons.md` for guidance

---

## 🎯 How to Use

1. **Visit any YouTube channel** (Home, Videos, Playlists - any tab works!)
2. **Click the QueueTube icon** in your Chrome toolbar
3. **Hit "🚀 Create QueueTube Playlist"**
4. **Watch as it opens the complete channel playlist!**

That's it! QueueTube will automatically find and open a playlist with ALL the channel's videos.

---

## 🔧 Technical Details

### File Structure
```
QueueTube/
├── manifest.json          # Extension config (with storage permission)
├── popup.html            # Main interface
├── popup.js              # Settings & controls
├── content.js            # YouTube integration
├── images/               # Extension icons
└── README.md             # This file
```

### Permissions Used
- **activeTab**: Access current YouTube page
- **scripting**: Inject playlist discovery code
- **storage**: Save settings and channel history *(Coming Soon)*

### How It Works
1. **Channel Detection**: Identifies current channel from any page
2. **Playlist Discovery**: Finds channel's upload playlist using multiple methods
3. **Smart Fallbacks**: Tries "Play All" buttons, upload playlists, and direct navigation
4. **Instant Launch**: Redirects to complete playlist automatically

---

## 🚨 Current Status

### ✅ Working Features
- **Playlist Creation**: Core functionality works perfectly
- **All Videos Access**: Gets complete uploads, not just visible ones
- **Smart Detection**: Works from any channel page
- **Multiple Methods**: Graceful fallbacks if one method fails

### 🔄 Coming Soon
- **Watch History**: Track which videos you've seen
- **Smart Filtering**: Skip watched/unwanted videos
- **Channel Management**: Organize your channel history

---

## 🚨 Troubleshooting

**Extension Not Working?**
- Ensure Developer mode is enabled in `chrome://extensions/`
- Try reloading the extension
- Check that all files are in the same folder

**"No videos found"?**
- Make sure you're on a channel page (not a single video)
- Try refreshing the page
- Some new channels might not have established playlists yet

**Playlist Too Large?**
- QueueTube uses YouTube's native system to handle large playlists
- Very large channels (5000+ videos) may take a moment to load

---

## 🤝 Contributing

Found a bug? Have a feature idea? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT License - feel free to use and modify!

---

<div align="center">

**Made with ❤️ for YouTube enthusiasts who love binge-watching entire channels**

[⭐ Star this repo](https://github.com/yourusername/QueueTube) if QueueTube helps you discover amazing content!

</div> 