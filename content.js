// QueueTube Content Script - True URL Hacking Approach
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createQueueTubePlaylist") {
    createQueueTubePlaylistFromChannel(request.settings);
  }
});

async function createQueueTubePlaylistFromChannel(settings) {
  console.log("🎬 QueueTube: Starting true URL hacking approach...", settings);
  console.log("Current URL:", window.location.href);
  
  showQueueTubeNotification("🔄 QueueTube is creating your playlist...", "info");

  try {
    // Force a fresh page analysis - no caching
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure page is loaded
    
    // Get channel information first
    const channelInfo = await getChannelInfo();
    console.log("📊 Current channel info:", channelInfo);

    // Validate we have channel info
    if (!channelInfo.channelId && !channelInfo.handle) {
      throw new Error("Could not detect channel information from current page");
    }

    // Save channel to history
    await saveChannelToHistory(channelInfo);

    if (settings.getAllVideos) {
      // Use URL hacking methods to create playlist directly
      await createPlaylistUsingURLHacking(channelInfo, settings);
    } else {
      // Fallback: create playlist from visible videos only
      await createPlaylistFromVisibleVideos(channelInfo, settings);
    }

  } catch (error) {
    console.error('QueueTube Error:', error);
    showQueueTubeNotification("❌ Error occurred. Trying fallback method...", "error");
    
    // Ultimate fallback
    try {
      const channelInfo = await getChannelInfo();
      await createDirectUploadsPlaylist(channelInfo);
    } catch (fallbackError) {
      showQueueTubeNotification("❌ Could not create playlist. Please try again from the channel's main page.", "error");
    }
  }
}

async function createPlaylistUsingURLHacking(channelInfo, settings) {
  console.log("🎯 Using URL hacking methods...");

  // Method 1: Look for existing "Play All" button on the page
  const playAllResult = await tryPlayAllButton(channelInfo, settings);
  if (playAllResult) {
    return;
  }

  // Method 2: Use the UU uploads playlist method
  const uploadsResult = await tryUploadsPlaylist(channelInfo, settings);
  if (uploadsResult) {
    return;
  }

  // Method 3: Use UL method with any video from the channel
  const ulResult = await tryULMethod(channelInfo, settings);
  if (ulResult) {
    return;
  }

  // Method 4: Navigate directly to uploads page
  await createDirectUploadsPlaylist(channelInfo);
}

async function tryPlayAllButton(channelInfo, settings) {
  showQueueTubeNotification("🔍 Looking for 'Play All' button...", "info");

  // Look for Play All buttons with various selectors
  const playAllSelectors = [
    '[aria-label*="Play all"]',
    '[title*="Play all"]', 
    '.ytd-shelf-renderer a[href*="list="]',
    'a[href*="list=UU"]',
    'a[href*="list=PL"]',
    '.yt-simple-endpoint[href*="list="]',
    '[role="button"][aria-label*="Play"]'
  ];

  for (const selector of playAllSelectors) {
    const buttons = document.querySelectorAll(selector);
    
    for (const button of buttons) {
      const href = button.getAttribute('href');
      if (href && href.includes('list=')) {
        const playlistId = href.match(/list=([^&]+)/)?.[1];
        
        if (playlistId && (playlistId.startsWith('UU') || playlistId.startsWith('PL'))) {
          showQueueTubeNotification("✅ Found 'Play All' playlist! Launching...", "success");
          
          const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
          await launchPlaylist(playlistUrl, `Play All (${playlistId})`, settings);
          return true;
        }
      }
    }
  }

  console.log("No Play All button found");
  return false;
}

async function tryUploadsPlaylist(channelInfo, settings) {
  if (!channelInfo.channelId) {
    console.log("No channel ID available for uploads method");
    return false;
  }

  showQueueTubeNotification("🎯 Trying uploads playlist method...", "info");

  // Convert UC channel ID to UU uploads playlist ID
  let uploadsPlaylistId = null;
  
  if (channelInfo.channelId.startsWith('UC')) {
    uploadsPlaylistId = 'UU' + channelInfo.channelId.substring(2);
  } else {
    // For other formats, try adding UU prefix
    uploadsPlaylistId = 'UU' + channelInfo.channelId;
  }

  const uploadsUrl = `https://www.youtube.com/playlist?list=${uploadsPlaylistId}`;
  
  showQueueTubeNotification(`🚀 Opening uploads playlist (${uploadsPlaylistId})!`, "success");
  await launchPlaylist(uploadsUrl, `Uploads (${uploadsPlaylistId})`, settings);
  return true;
}

async function tryULMethod(channelInfo, settings) {
  showQueueTubeNotification("🔍 Trying UL method with channel videos...", "info");

  // Find any video from this channel on the current page
  const videoLinks = document.querySelectorAll('a[href*="/watch?v="]');
  
  for (const link of videoLinks) {
    const href = link.getAttribute('href');
    if (href) {
      const videoId = extractVideoIdFromUrl(href);
      if (videoId) {
        // Create UL playlist URL by appending &list=UL to the video URL
        const ulUrl = `https://www.youtube.com/watch?v=${videoId}&list=UL`;
        
        showQueueTubeNotification("🚀 Creating UL playlist from channel video!", "success");
        await launchPlaylist(ulUrl, `UL Playlist (${videoId})`, settings);
        return true;
      }
    }
  }

  console.log("No videos found for UL method");
  return false;
}

async function createDirectUploadsPlaylist(channelInfo) {
  showQueueTubeNotification("📺 Navigating to channel uploads...", "info");

  let uploadsUrl = null;

  // Try different URL patterns based on what we know about the channel
  if (channelInfo.handle) {
    uploadsUrl = `https://www.youtube.com/@${channelInfo.handle}/videos`;
  } else if (channelInfo.channelId) {
    uploadsUrl = `https://www.youtube.com/channel/${channelInfo.channelId}/videos`;
  } else {
    // Try to find the uploads tab on current page
    const uploadsTab = document.querySelector('a[href*="/videos"]') || 
                      document.querySelector('[role="tab"] a[href*="/videos"]');
    
    if (uploadsTab) {
      uploadsUrl = new URL(uploadsTab.href, window.location.origin).href;
    }
  }

  if (uploadsUrl) {
    showQueueTubeNotification("🚀 Opening channel videos page!", "success");
    setTimeout(() => {
      window.location.href = uploadsUrl;
    }, 1500);
  } else {
    showQueueTubeNotification("❌ Could not determine uploads URL", "error");
  }
}

async function createPlaylistFromVisibleVideos(channelInfo, settings) {
  showQueueTubeNotification("📄 Creating playlist from visible videos...", "info");

  // Get videos from current page
  const videoIds = await getVideoIdsFromCurrentPage();
  
  if (videoIds.length === 0) {
    showQueueTubeNotification("❌ No videos found on current page", "error");
    await createDirectUploadsPlaylist(channelInfo);
    return;
  }

  // Apply filters if needed
  let filteredVideoIds = videoIds;
  if (settings.skipWatched && channelInfo.channelId) {
    filteredVideoIds = await applyVideoFilters(videoIds, channelInfo.channelId, settings);
  }

  if (filteredVideoIds.length === 0) {
    showQueueTubeNotification("ℹ️ All videos filtered out", "info");
    await createDirectUploadsPlaylist(channelInfo);
    return;
  }

  // Create custom playlist
  const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${filteredVideoIds.join(',')}`;
  await launchPlaylist(playlistUrl, `Custom (${filteredVideoIds.length} videos)`, settings);
}

async function getVideoIdsFromCurrentPage() {
  const videoSelectors = [
    'a#video-title-link',
    'a[href*="/watch?v="]',
    'ytd-video-renderer a[href*="/watch"]',
    'ytd-grid-video-renderer a[href*="/watch"]'
  ];

  const videoIds = new Set();

  videoSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const href = element.getAttribute('href');
      if (href) {
        const videoId = extractVideoIdFromUrl(href);
        if (videoId) {
          videoIds.add(videoId);
        }
      }
    });
  });

  return Array.from(videoIds);
}

function extractVideoIdFromUrl(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

async function getChannelInfo() {
  // Force fresh extraction - no caching
  console.log("🔍 Extracting channel info from current page:", window.location.href);
  
  // Enhanced channel info extraction with more selectors
  const channelName = 
    document.querySelector('#channel-name')?.textContent?.trim() ||
    document.querySelector('.ytd-c4-tabbed-header-renderer h1')?.textContent?.trim() ||
    document.querySelector('yt-formatted-string.ytd-channel-name')?.textContent?.trim() ||
    document.querySelector('#text.ytd-channel-name')?.textContent?.trim() ||
    document.querySelector('.ytd-channel-name yt-formatted-string')?.textContent?.trim() ||
    document.querySelector('[itemprop="name"]')?.textContent?.trim() ||
    document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.replace(' - YouTube', '') ||
    document.querySelector('meta[name="title"]')?.getAttribute('content')?.replace(' - YouTube', '') ||
    document.title.replace(' - YouTube', '') ||
    'Unknown Channel';

  const channelId = extractChannelId();
  const channelHandle = extractChannelHandle();
  
  const channelInfo = {
    name: channelName,
    channelId: channelId,
    handle: channelHandle,
    url: window.location.href,
    timestamp: Date.now() // Add timestamp to ensure freshness
  };
  
  console.log("📊 Extracted channel info:", channelInfo);
  return channelInfo;
}

function extractChannelId() {
  const url = window.location.href;
  console.log("🔍 Extracting channel ID from URL:", url);

  // Extract from URL patterns - most reliable
  let match = url.match(/youtube\.com\/channel\/([^\/\?&]+)/);
  if (match) {
    console.log("✅ Found channel ID from /channel/ URL:", match[1]);
    return match[1];
  }

  match = url.match(/youtube\.com\/c\/([^\/\?&]+)/);
  if (match) {
    console.log("⚠️ Found custom URL /c/, need to find real channel ID:", match[1]);
    // For /c/ URLs, we need to find the actual UC channel ID
  }

  match = url.match(/youtube\.com\/user\/([^\/\?&]+)/);
  if (match) {
    console.log("⚠️ Found /user/ URL, need to find real channel ID:", match[1]);
  }

  // Extract from canonical link first (most reliable for @username and /c/ pages)
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    const canonicalMatch = canonical.href.match(/youtube\.com\/channel\/([^\/\?&]+)/);
    if (canonicalMatch) {
      console.log("✅ Found channel ID from canonical link:", canonicalMatch[1]);
      return canonicalMatch[1];
    }
  }

  // Try to extract from page data
  const scripts = document.querySelectorAll('script');
  for (const script of scripts) {
    const content = script.textContent || '';
    
    // Look for channelId in various formats
    const patterns = [
      /"channelId":"([^"]+)"/,
      /"browseId":"(UC[^"]+)"/,
      /"externalId":"([^"]+)"/,
      /channel_id['"]\s*:\s*['"]([^'"]+)['"]/,
      /"ucid":"([^"]+)"/
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        console.log("✅ Found channel ID from script data:", match[1]);
        return match[1];
      }
    }
  }

  // Try meta tags
  const metaChannelId = document.querySelector('meta[itemprop="channelId"]')?.getAttribute('content') ||
                       document.querySelector('meta[property="og:url"]')?.getAttribute('content')?.match(/channel\/([^\/\?&]+)/)?.[1];
  
  if (metaChannelId) {
    console.log("✅ Found channel ID from meta tags:", metaChannelId);
    return metaChannelId;
  }

  console.log("❌ Could not extract channel ID");
  return null;
}

function extractChannelHandle() {
  const url = window.location.href;
  const match = url.match(/youtube\.com\/@([^\/\?&]+)/);
  return match ? match[1] : null;
}

async function applyVideoFilters(videoIds, channelId, settings) {
  if (!settings.skipWatched || !channelId) {
    return videoIds;
  }

  try {
    const data = await chrome.storage.sync.get(['channelHistory']);
    const history = data.channelHistory || {};
    const channelData = history[channelId] || {};

    const watchedVideos = new Set(channelData.watchedVideos || []);
    const skippedVideos = new Set(channelData.skippedVideos || []);

    const filteredIds = videoIds.filter(videoId =>
      !watchedVideos.has(videoId) && !skippedVideos.has(videoId)
    );

    const filtered = videoIds.length - filteredIds.length;
    if (filtered > 0) {
      showQueueTubeNotification(`⏭️ Filtered out ${filtered} watched/skipped videos`, "info");
    }

    return filteredIds;
  } catch (error) {
    console.log("Error applying filters:", error);
    return videoIds;
  }
}

async function saveChannelToHistory(channelInfo) {
  if (!channelInfo.channelId) return;

  try {
    const data = await chrome.storage.sync.get(['channelHistory']);
    const history = data.channelHistory || {};

    // Clean and validate channel name
    const cleanName = (channelInfo.name || 'Unknown Channel')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!history[channelInfo.channelId]) {
      history[channelInfo.channelId] = {
        name: cleanName,
        url: channelInfo.url,
        handle: channelInfo.handle,
        firstProcessed: new Date().toISOString(),
        watchedVideos: [],
        skippedVideos: []
      };
      console.log("📝 Added new channel to history:", cleanName);
    } else {
      // Update existing entry
      history[channelInfo.channelId].name = cleanName; // Update name in case it changed
      history[channelInfo.channelId].url = channelInfo.url; // Update URL
      console.log("📝 Updated existing channel in history:", cleanName);
    }

    history[channelInfo.channelId].lastProcessed = new Date().toISOString();

    await chrome.storage.sync.set({ channelHistory: history });
    console.log("💾 Channel history saved successfully");
  } catch (error) {
    console.log("❌ Error saving to history:", error);
  }
}

async function launchPlaylist(playlistUrl, playlistType, settings) {
  showQueueTubeNotification(`🚀 Launching ${playlistType} playlist!`, "success");
  
  console.log(`🎬 QueueTube: Launching ${playlistType}:`, playlistUrl);

  // Auto-mark as watched if enabled and it's a custom playlist
  if (settings.autoMarkWatched && playlistUrl.includes('watch_videos')) {
    try {
      const videoIds = playlistUrl.match(/video_ids=([^&]+)/)?.[1]?.split(',') || [];
      const channelInfo = await getChannelInfo();
      if (channelInfo.channelId && videoIds.length > 0) {
        await markVideosAsWatched(videoIds, channelInfo.channelId);
      }
    } catch (error) {
      console.log("Error marking videos as watched:", error);
    }
  }

  setTimeout(() => {
    window.location.href = playlistUrl;
  }, 2000);
}

async function markVideosAsWatched(videoIds, channelId) {
  try {
    const data = await chrome.storage.sync.get(['channelHistory']);
    const history = data.channelHistory || {};

    if (!history[channelId]) return;

    const watchedSet = new Set(history[channelId].watchedVideos || []);
    videoIds.forEach(id => watchedSet.add(id));

    history[channelId].watchedVideos = Array.from(watchedSet);
    await chrome.storage.sync.set({ channelHistory: history });
  } catch (error) {
    console.log("Error marking videos as watched:", error);
  }
}

function showQueueTubeNotification(message, type = "info") {
  const existingNotification = document.getElementById('queuetube-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'queuetube-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#5352ed'};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 350px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  if (!document.getElementById('queuetube-styles')) {
    const style = document.createElement('style');
    style.id = 'queuetube-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (type !== 'success') {
    setTimeout(() => {
      if (notification && notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
} 