import { displayIntention } from "./displayIntentions";

export function addIntention() {
  const intention = document.getElementById('add-intention-input').value.trim();
  displayIntention(intention);
  console.log(intention);
}