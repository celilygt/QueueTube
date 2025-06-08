# 🎬 QueueTube - YouTube Channel Playlist Generator

**QueueTube** is a powerful Chrome extension that instantly creates a playlist from all videos on any YouTube channel's "Videos" tab. With just one click, transform any channel into a continuous playlist experience!

## ✨ Features

- 🚀 **One-Click Playlist Creation**: Generate playlists instantly from any YouTube channel
- 📺 **Complete Channel Coverage**: Uses smart YouTube integration methods to access ALL channel videos
- 🎯 **Smart Video Filtering**: Skip watched videos and permanently skipped videos *(Coming Soon)*
- 👁️ **Watch History Tracking**: Keep track of videos you've already watched *(Coming Soon)*
- 📊 **Channel History Management**: Track all channels you've processed with stats *(Coming Soon)*
- ⚙️ **Advanced Settings**: Customizable options for video processing
- 💫 **Beautiful Modern UI**: Tabbed interface with settings and history management
- 🔄 **Real-time Progress**: Visual notifications show detailed progress during scanning
- 🌟 **QueueTube Branding**: Consistent QueueTube experience throughout

## 🛠️ Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Download the Extension Files**
   - Clone or download this repository to your computer
   - Make sure you have all files: `manifest.json`, `popup.html`, `popup.js`, `content.js`

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Toggle on **"Developer mode"** (top-right corner)

3. **Load the Extension**
   - Click **"Load unpacked"**
   - Select the `QueueTube` folder containing all the extension files
   - QueueTube should now appear in your extensions list!

### Method 2: Icons (Optional but Recommended)

Create an `images` folder and add these icon files for the best experience:
- `icon16.png` (16×16 pixels)
- `icon48.png` (48×48 pixels) 
- `icon128.png` (128×128 pixels)

*Note: The extension works without icons, but will show a default puzzle piece icon.*

## 🎯 How to Use QueueTube

1. **Navigate to YouTube**
   - Go to [youtube.com](https://youtube.com)
   - Find any channel you want to create a playlist from

2. **Visit Any Channel Page**
   - Click on the channel name to visit their channel page
   - You can be on **any** tab: Home, Videos, Playlists, Community, etc.

3. **Configure QueueTube (Optional)**
   - Click the QueueTube icon in your Chrome toolbar
   - Switch to the **Settings** tab to configure:
     - **Skip watched videos**: Exclude videos you've already seen *(Coming Soon)*
     - **Use smart URL methods**: Try multiple YouTube URL patterns (recommended)
     - **Auto-mark as watched**: Automatically track videos in created playlists *(Coming Soon)*

4. **Launch QueueTube**
   - Click **"🚀 Create QueueTube Playlist"**
   - QueueTube will use smart playlist discovery methods to access ALL channel videos
   - Progress notifications keep you updated with real-time stats

5. **Manage Your History** *(Coming Soon)*
   - Switch to the **History** tab to see all processed channels
   - View stats: watched videos, skipped videos, total videos
   - **Refresh** a channel to reset watched/skipped status
   - **Delete** channels from your history when needed

## 🔧 Technical Details

### File Structure
```
QueueTube/
├── manifest.json          # Extension configuration
├── popup.html            # Popup interface
├── popup.js              # Popup functionality
├── content.js            # YouTube page interaction
├── images/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Permissions Used
- **activeTab**: Access to the current YouTube tab
- **scripting**: Inject content script for video scanning

### Browser Compatibility
- Chrome (Manifest V3)
- Microsoft Edge
- Other Chromium-based browsers

## 🎥 What QueueTube Does

1. **Smart Channel Detection**: Works from any channel page (Home, Videos, Playlists, etc.)
2. **Playlist Discovery**: Uses multiple YouTube integration methods to find complete playlists
3. **Upload Playlist Access**: Automatically finds and accesses channel upload playlists
4. **Fallback Methods**: Multiple strategies ensure playlist creation always works
5. **Direct Navigation**: Redirects to complete playlists with ALL channel videos
6. **Real-time Feedback**: Progress notifications keep you informed throughout the process

## 🚨 Current Limitations

### Features Under Development
- **Watch History Tracking**: The extension currently doesn't save which videos you've watched
- **Skip Watched Videos**: This setting is visible but not yet functional
- **Channel History Management**: The History tab shows channels but buttons may not work reliably
- **Auto-mark as Watched**: This feature is not yet implemented

### Working Features
- ✅ **Playlist Creation**: Core functionality works perfectly
- ✅ **All Channel Videos**: Gets complete channel uploads, not just visible ones
- ✅ **Multiple Methods**: Falls back gracefully if one method doesn't work
- ✅ **Real-time Notifications**: Shows progress during playlist creation

## 🚨 Troubleshooting

### "No videos found" Error
- Make sure you're on any **channel page** (Home, Videos, Playlists, etc.)
- Try refreshing the page and waiting for it to fully load
- Some channels may have their videos in different sections

### Extension Not Working
- Verify all files are in the same folder
- Check that Developer mode is enabled in Chrome
- Try reloading the extension in `chrome://extensions/`

### Playlist Too Long
- YouTube has limits on playlist URLs (~200 videos typically work)
- For channels with 1000+ videos, the URL might be too long
- QueueTube will try to use YouTube's native playlist system to handle this

## 🤝 Contributing

Want to improve QueueTube? Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Share feedback

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Enjoy QueueTube!

Transform any YouTube channel into your personal playlist with QueueTube. Happy watching! 🍿

---

*Created with ❤️ for YouTube enthusiasts who love binge-watching entire channels.* 