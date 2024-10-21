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
    const jsonIntentions = JSON.stringify(intentions);
    localStorage.setItem('intentions', jsonIntentions);
    return intentions;
}

export function loadIntentionsFromLocalStorage() {
    const jsonIntentions = localStorage?.getItem('intentions') ?? JSON.stringify(['placeholder intention']);
    const intentions = JSON.parse(jsonIntentions);
    return intentions;
}