import { displayIntention } from "./displayIntentions";

export function addIntention() {
  const intention = document.getElementById('add-intention-input').value.trim();
  //addIntentionToLocalStorage(intention);
  
  displayIntention(intention);
  console.log(intention);
}



function addIntentionToLocalStorage(intention) {

}

export function loadIntentionsFromLocalStorage() {
    const jsonIntentions = localStorage?.getItem('intentions') ?? JSON.stringify(['placeholder intention']);
    const intentionsArray = JSON.parse(jsonIntentions);
    return intentionsArray;
}