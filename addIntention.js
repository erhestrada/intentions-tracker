import { displayIntention } from "./displayIntentions";

export function addIntention() {
  const intention = document.getElementById('add-intention-input').value.trim();
  addIntentionToLocalStorage(intention);

  const timesPerDay = document.getElementById('times-per-day-input').value;
  
  displayIntention(intention);
  displayIntention(timesPerDay);
  console.log(intention);
  document.getElementById('add-intention-input').value = ''; // clear input when intention added
}

function addIntentionToLocalStorage(intention) {
    let intentions = loadIntentionsFromLocalStorage();
    intentions.push(intention);
    saveDataToLocalStorage('intentions', intentions);
    return intentions;
}

export function loadIntentionsFromLocalStorage() {
    const jsonIntentions = localStorage?.getItem('intentions') ?? JSON.stringify(['placeholder intention']);
    const intentions = JSON.parse(jsonIntentions);
    return intentions;
}

export function saveDataToLocalStorage(key, data) {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
  return jsonData
}