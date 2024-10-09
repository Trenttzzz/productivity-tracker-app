let timers = [];
let intervals = [];

// Define target times for each activity in hundredths of a second
const targetTimes = [
  parseTime("01:10.24"), // Target for Activity 1
  parseTime("03:15.23"), // Target for Activity 2
  parseTime("00:05.36")  // Target for Activity 3
];

// Function to format time
function formatTime(time) {
  let minutes = Math.floor(time / 6000);
  let seconds = Math.floor((time % 6000) / 100);
  let hundredths = time % 100;

  return (
    (minutes < 10 ? "0" : "") + minutes +
    ":" +
    (seconds < 10 ? "0" : "") + seconds +
    "." +
    (hundredths < 10 ? "0" : "") + hundredths
  );
}

// Function to parse time from the format "mm:ss.hh" to hundredths of seconds
function parseTime(timeStr) {
  const [minutes, rest] = timeStr.split(":");
  const [seconds, hundredths] = rest.split(".");

  return (
    parseInt(minutes) * 6000 +
    parseInt(seconds) * 100 +
    parseInt(hundredths)
  );
}

// Start the timer
function startTimer(index) {
  if (!intervals[index]) {
    intervals[index] = setInterval(() => {
      timers[index]++;
      document.querySelectorAll('.activity-card p:nth-child(2)')[index].textContent = formatTime(timers[index]);
    }, 10); // Update every hundredth of a second
  }
}

// Save to Local Storage
function saveToLocalStorage(activity, time, performance) {
  let pastActivities = JSON.parse(localStorage.getItem('pastActivities')) || [];
  pastActivities.push({ activity, time, performance });
  localStorage.setItem('pastActivities', JSON.stringify(pastActivities));
}

// Load data from Local Storage
function loadFromLocalStorage() {
  const pastActivities = JSON.parse(localStorage.getItem('pastActivities')) || [];
  const pastActivityTable = document.querySelector('table');

  pastActivities.forEach(({ activity, time, performance }) => {
    const newRow = pastActivityTable.insertRow();
    newRow.innerHTML = `
      <td>${activity}</td>
      <td>${time}</td>
      <td>${performance}</td>
    `;
  });
}

// Calculate performance based on target time and elapsed time
function calculatePerformance(targetTime, elapsedTime) {
  if (elapsedTime < targetTime) {
    return ((targetTime / elapsedTime).toFixed(0) + ' x 100%');
  } else {
    return ((targetTime / elapsedTime) * 100).toFixed(2) + '%';
  }
}


// Stop the timer, reset it, display result, and save it
function stopTimer(index) {
  if (intervals[index]) {
    clearInterval(intervals[index]);
    intervals[index] = null;

    // Get the activity name and time
    const activityName = document.querySelectorAll('.activity-card p:nth-child(1)')[index].textContent;
    const elapsedTimeStr = document.querySelectorAll('.activity-card p:nth-child(2)')[index].textContent;

    console.log('Stopping timer for:', activityName, 'Elapsed Time:', elapsedTimeStr);

    // Parse elapsed time
    const elapsedTime = parseTime(elapsedTimeStr);

    // Get target time from predefined array
    const targetTime = targetTimes[index];

    // Calculate performance
    const performance = calculatePerformance(targetTime, elapsedTime);

    // Display the result in the table
    const pastActivityTable = document.querySelector('table');
    const newRow = pastActivityTable.insertRow();
    newRow.innerHTML = `
      <td>${activityName}</td>
      <td>${elapsedTimeStr}</td>
      <td>${performance}</td>
    `;

    // Save to Local Storage
    saveToLocalStorage(activityName, elapsedTimeStr, performance);

    // Reset the timer display to 00:00.00
    timers[index] = 0;
    document.querySelectorAll('.activity-card p:nth-child(2)')[index].textContent = "00:00.00";
  }
}

// Attach event listeners to Start and Stop buttons
document.addEventListener('DOMContentLoaded', () => {
  timers = Array.from(document.querySelectorAll('.activity-card p:nth-child(2)')).map(() => 0);

  // Load past activities from Local Storage
  loadFromLocalStorage();

  document.querySelectorAll('.start').forEach((button, index) => {
    button.addEventListener('click', () => startTimer(index));
  });

  document.querySelectorAll('.stop').forEach((button, index) => {
    button.addEventListener('click', () => stopTimer(index));
  });
});
