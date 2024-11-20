import { displaySquares } from "./displaySquares";

export function addIntention() {
  let requiredRepetitionsPerIntention = JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {};
  const intention = document.getElementById('add-intention-input').value.trim();
  const requiredRepetitions = document.getElementById('required-repetitions-input').value;
  requiredRepetitionsPerIntention[intention] = requiredRepetitions;
  localStorage.setItem('requiredRepetitionsPerIntention', JSON.stringify(requiredRepetitionsPerIntention));

  displaySquares({[intention]: requiredRepetitions});
  document.getElementById('add-intention-input').value = ''; // clear input when intention added
}

/*
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
*/

export function saveDataToLocalStorage(key, data) {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
  return jsonData
}
