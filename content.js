// Detect platform and URL
const platform = window.location.hostname;
let isReel = false;

if (platform.includes('instagram.com') && window.location.pathname.startsWith('/reel/')) {
  isReel = true;
} else if (platform.includes('youtube.com') && window.location.pathname.startsWith('/shorts/')) {
  isReel = true;
} else if (platform.includes('facebook.com') && window.location.pathname.includes('/reels/')) {
  isReel = true;
}

if (isReel) {
  console.log("Content script: Detected Reel/Shorts");

  // Send message to background script
  chrome.runtime.sendMessage({
    type: 'REEL_VIEWED',
    platform: platform,
    url: window.location.href
  });
}