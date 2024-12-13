import { displaySquares } from "./displaySquares";
import { storeRequiredRepetitionsForIntention } from "./storeRequiredRepetitionsForIntention";
import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";

export function addIntention(uuid) {
  //let requiredRepetitionsPerIntention = JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {};
  let requiredRepetitionsPerIntention = retrieveRequiredRepetitionsPerIntention(uuid);
  const intention = document.getElementById('add-intention-input').value.trim();
  const requiredRepetitions = document.getElementById('required-repetitions-input').value;
  requiredRepetitionsPerIntention[intention] = requiredRepetitions;
  //localStorage.setItem('requiredRepetitionsPerIntention', JSON.stringify(requiredRepetitionsPerIntention));
  storeRequiredRepetitionsForIntention(uuid, intention, requiredRepetitions);

  displaySquares({[intention]: requiredRepetitions});
  document.getElementById('add-intention-input').value = ''; // clear input when intention added
}

export function saveDataToLocalStorage(key, data) {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
  return jsonData
}
