import { calculateStreaks } from "./calculateStreaks";

export function displayStreaks() {
    const statesOfCheckboxes = JSON.parse(localStorage.getItem('statesOfCheckboxes')) || {};
    const streaks = calculateStreaks(statesOfCheckboxes);
    console.log('streaks', streaks);
}