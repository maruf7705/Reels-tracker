document.addEventListener('DOMContentLoaded', async () => {
  const { data, timeSpent } = await chrome.storage.local.get(["data", "timeSpent"]);
  const todayCount = document.getElementById('today-count');
  const instagramCount = document.getElementById('instagram-count');
  const facebookCount = document.getElementById('facebook-count');
  const youtubeCount = document.getElementById('youtube-count');
  const instagramTime = document.getElementById('instagram-time');
  const facebookTime = document.getElementById('facebook-time');
  const youtubeTime = document.getElementById('youtube-time');
  const resetButton = document.getElementById('reset-data');
  const calendar = document.getElementById('calendar');
  const timeSpentList = document.getElementById('time-spent-list');

  calendar.innerHTML = "";
  timeSpentList.innerHTML = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayStr = today.toISOString().split('T')[0];

  // Display today's count
  todayCount.textContent = data?.[todayStr] || 0;

  // Display time spent today
  const todayTimeSpent = timeSpent?.[todayStr] || {};
  for (const [platform, seconds] of Object.entries(todayTimeSpent)) {
    const listItem = document.createElement("li");
    listItem.innerText = `${platform}: ${formatTime(seconds)}`;
    timeSpentList.appendChild(listItem);
  }

  // Update platform stats
  instagramCount.textContent = data?.[todayStr]?.Instagram || 0;
  facebookCount.textContent = data?.[todayStr]?.Facebook || 0;
  youtubeCount.textContent = data?.[todayStr]?.YouTube || 0;
  instagramTime.textContent = formatTime(todayTimeSpent?.Instagram || 0);
  facebookTime.textContent = formatTime(todayTimeSpent?.Facebook || 0);
  youtubeTime.textContent = formatTime(todayTimeSpent?.YouTube || 0);

  // Generate calendar
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("day");
    calendar.appendChild(emptyCell);
  }

  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.innerText = day;

    if (data?.[dateStr]) {
      dayCell.classList.add("highlight");
      dayCell.title = `${data[dateStr]} Reels watched`;
    }

    dayCell.addEventListener("click", () => {
      alert(`Reels watched on ${dateStr}: ${data?.[dateStr] || 0}`);
    });

    calendar.appendChild(dayCell);
  }

  // Reset button functionality
  resetButton.addEventListener("click", async () => {
    if (confirm("Are you sure you want to reset all data?")) {
      await chrome.storage.local.set({ data: {}, timeSpent: {} });
      location.reload();
    }
  });
});

// Helper function to format time in HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}