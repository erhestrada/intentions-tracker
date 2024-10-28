import { loadArrayFromLocalStorage } from "./updateIntentionsLog";

function displayProgress() {
    const intentionsLog = loadArrayFromLocalStorage('intentionsLog');
    const intentionsLogContainer = document.getElementById('intentions-log-container');
    for (const intentionAndDateTime of intentionsLog) {
        const [intention, dateTime] = intentionAndDateTime;
        
        const intentionEntry = document.createElement('p');
        intentionEntry.innerText = intention + ' ' + formatTime(dateTime);

        intentionsLogContainer.appendChild(intentionEntry);
    }
}

function formatTime(dateTime) {
    // Create a Date object from the string
    const date = new Date(dateTime);
    
    // Extract hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Format minutes with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Combine to get the final formatted time
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
    
    // Replace the time portion in the original date string
    const newDateString = dateTime.replace(/(\d{2}:\d{2}:\d{2})/, formattedTime);
    return newDateString    
}

displayProgress();