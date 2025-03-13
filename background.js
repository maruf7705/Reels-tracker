// Initialize storage on installation
chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({ data: {}, timeSpent: {} });
  });
  
  // Track which tab is currently active
  let activeTabId = null;
  let startTime = null;
  
  // Listen for tab updates to detect Reels pages
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url && isValidReelUrl(changeInfo.url)) {
      const today = new Date().toISOString().split('T')[0];
      let { data } = await chrome.storage.local.get("data");
  
      data = data || {}; // Ensure data exists
      data[today] = (data[today] || 0) + 1;
  
      await chrome.storage.local.set({ data });
    }
  });
  
  // Listen for tab activation
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url && isValidReelUrl(tab.url)) {
      activeTabId = activeInfo.tabId;
      startTime = Date.now(); // Record start time
    } else {
      stopTrackingTime();
    }
  });
  
  // Listen for tab focus changes
  chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      stopTrackingTime();
    }
  });
  
  // Stop tracking time and save it
  function stopTrackingTime() {
    if (activeTabId && startTime) {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
      chrome.tabs.get(activeTabId, async (tab) => {
        if (tab && tab.url && isValidReelUrl(tab.url)) {
          const platform = getPlatformFromUrl(tab.url);
          const today = new Date().toISOString().split('T')[0];
          let { timeSpent } = await chrome.storage.local.get("timeSpent");
  
          timeSpent = timeSpent || {};
          timeSpent[today] = timeSpent[today] || {};
          timeSpent[today][platform] = (timeSpent[today][platform] || 0) + elapsedTime;
  
          await chrome.storage.local.set({ timeSpent });
        }
      });
      activeTabId = null;
      startTime = null;
    }
  }
  
  // Helper function to validate Reel URLs
  function isValidReelUrl(url) {
    if (!url) return false; // Add a check to ensure url is defined
    return (
      url.includes("instagram.com/reels") ||
      url.includes("youtube.com/shorts") ||
      url.includes("facebook.com/reels")
    );
  }
  
  // Helper function to extract platform from URL
  function getPlatformFromUrl(url) {
    if (url.includes("instagram.com")) return "Instagram";
    if (url.includes("youtube.com")) return "YouTube";
    if (url.includes("facebook.com")) return "Facebook";
    return "Unknown";
  }