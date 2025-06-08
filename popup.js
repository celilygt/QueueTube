// QueueTube Popup Script with Advanced Features
document.addEventListener('DOMContentLoaded', async () => {
  const createPlaylistBtn = document.getElementById('createPlaylistBtn');
  const statusEl = document.getElementById('status');
  const skipWatchedToggle = document.getElementById('skipWatchedToggle');
  const getAllVideosToggle = document.getElementById('getAllVideosToggle');
  const autoMarkWatchedToggle = document.getElementById('autoMarkWatchedToggle');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const channelHistoryEl = document.getElementById('channelHistory');

  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update active content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
          content.classList.add('active');
        }
      });
      
      if (tabName === 'history') {
        loadChannelHistory();
      }
    });
  });

  // Load settings from storage
  await loadSettings();
  
  // Load channel history
  await loadChannelHistory();

  // Check current tab and update status
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    
    // Check if we're on a YouTube channel page (any tab)
    const isChannelPage = currentUrl && currentUrl.includes('youtube.com/') && 
      (currentUrl.includes('/channel/') || 
       currentUrl.includes('/c/') || 
       currentUrl.includes('/@') ||
       currentUrl.includes('/user/'));
    
    if (isChannelPage) {
      createPlaylistBtn.disabled = false;
      statusEl.textContent = '✅ Ready! Click to create your QueueTube playlist.';
    } else if (currentUrl && currentUrl.includes('youtube.com/')) {
      createPlaylistBtn.disabled = true;
      statusEl.textContent = '📺 Navigate to any YouTube channel page to use QueueTube.';
    } else {
      createPlaylistBtn.disabled = true;
      statusEl.textContent = '🌐 Please navigate to YouTube first, then to any channel page.';
    }
  });

  // Settings toggle handlers
  skipWatchedToggle.addEventListener('click', async () => {
    const isActive = skipWatchedToggle.classList.toggle('active');
    await chrome.storage.sync.set({ skipWatched: isActive });
  });

  getAllVideosToggle.addEventListener('click', async () => {
    const isActive = getAllVideosToggle.classList.toggle('active');
    await chrome.storage.sync.set({ getAllVideos: isActive });
  });

  autoMarkWatchedToggle.addEventListener('click', async () => {
    const isActive = autoMarkWatchedToggle.classList.toggle('active');
    await chrome.storage.sync.set({ autoMarkWatched: isActive });
  });

  // Clear history handler
  clearHistoryBtn.addEventListener('click', async () => {
    if (confirm('Clear all channel history and watched videos?')) {
      await chrome.storage.sync.clear();
      await loadSettings(); // Reload default settings
      await loadChannelHistory();
    }
  });

  // Main playlist creation handler
  createPlaylistBtn.addEventListener('click', async () => {
    const settings = await getSettings();
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Send message with current settings
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: "createQueueTubePlaylist",
        settings: settings
      });
      
      statusEl.textContent = "🔄 QueueTube is working... Please wait.";
      createPlaylistBtn.disabled = true;
      
      setTimeout(() => {
        window.close();
      }, 1500);
    });
  });

  async function loadSettings() {
    const settings = await chrome.storage.sync.get({
      skipWatched: false,
      getAllVideos: true,
      autoMarkWatched: false
    });

    skipWatchedToggle.classList.toggle('active', settings.skipWatched);
    getAllVideosToggle.classList.toggle('active', settings.getAllVideos);
    autoMarkWatchedToggle.classList.toggle('active', settings.autoMarkWatched);
  }

  async function getSettings() {
    return await chrome.storage.sync.get({
      skipWatched: false,
      getAllVideos: true,
      autoMarkWatched: false
    });
  }

  async function loadChannelHistory() {
    const data = await chrome.storage.sync.get(['channelHistory']);
    const history = data.channelHistory || {};
    
    if (Object.keys(history).length === 0) {
      channelHistoryEl.innerHTML = `
        <div style="text-align: center; opacity: 0.7; font-size: 12px; padding: 20px;">
          No channels processed yet
        </div>
      `;
      return;
    }

    // Clear existing content
    channelHistoryEl.innerHTML = '';

    // Create channel items with proper event listeners
    Object.entries(history).forEach(([channelId, data]) => {
      const watchedCount = data.watchedVideos ? data.watchedVideos.length : 0;
      const skippedCount = data.skippedVideos ? data.skippedVideos.length : 0;
      
      // Clean and format channel name
      const channelName = (data.name || 'Unknown Channel').replace(/[<>]/g, '').trim();
      const lastProcessed = data.lastProcessed ? new Date(data.lastProcessed).toLocaleDateString() : 'Unknown';
      
      const channelItem = document.createElement('div');
      channelItem.className = 'channel-item';
      channelItem.innerHTML = `
        <div class="channel-name">
          <div title="${channelName}">${channelName}</div>
          <div class="stats">
            👁️ ${watchedCount} watched • ⏭️ ${skippedCount} skipped • ${lastProcessed}
          </div>
        </div>
        <div class="channel-actions">
          <button class="small-btn refresh-btn" data-channel-id="${channelId}" title="Reset watched/skipped videos">🔄</button>
          <button class="small-btn delete-btn" data-channel-id="${channelId}" title="Delete from history">🗑️</button>
        </div>
      `;
      
      // Add event listeners
      const refreshBtn = channelItem.querySelector('.refresh-btn');
      const deleteBtn = channelItem.querySelector('.delete-btn');
      
      refreshBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await refreshChannel(channelId, channelName);
      });
      
      deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await deleteChannel(channelId, channelName);
      });
      
      channelHistoryEl.appendChild(channelItem);
    });
  }

  // Channel management functions
  async function refreshChannel(channelId, channelName) {
    try {
      const data = await chrome.storage.sync.get(['channelHistory']);
      const history = data.channelHistory || {};
      
      if (history[channelId]) {
        // Clear watched and skipped videos for this channel
        history[channelId].watchedVideos = [];
        history[channelId].skippedVideos = [];
        await chrome.storage.sync.set({ channelHistory: history });
        await loadChannelHistory();
        
        statusEl.textContent = `✅ Refreshed ${channelName}`;
        setTimeout(() => {
          statusEl.textContent = '✅ Ready! Click to create your QueueTube playlist.';
        }, 3000);
      }
    } catch (error) {
      console.error('Error refreshing channel:', error);
      statusEl.textContent = '❌ Error refreshing channel';
    }
  }

  async function deleteChannel(channelId, channelName) {
    try {
      if (confirm(`Delete "${channelName}" from history?\n\nThis will remove all watch history for this channel.`)) {
        const data = await chrome.storage.sync.get(['channelHistory']);
        const history = data.channelHistory || {};
        
        delete history[channelId];
        await chrome.storage.sync.set({ channelHistory: history });
        await loadChannelHistory();
        
        statusEl.textContent = `🗑️ Deleted ${channelName}`;
        setTimeout(() => {
          statusEl.textContent = '✅ Ready! Click to create your QueueTube playlist.';
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
      statusEl.textContent = '❌ Error deleting channel';
    }
  }
}); 