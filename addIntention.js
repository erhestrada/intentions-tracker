import { displayIntention } from "./displayIntentions";

export function addIntention() {
  const intention = document.getElementById('add-intention-input').value.trim();
  addIntentionToLocalStorage(intention);
  
  displayIntention(intention);
  console.log(intention);
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
  jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
  return jsonData
}