import { loadIntentionsFromLocalStorage, addIntention } from "./addIntention";

const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addIntention();
  });

const intentionsArray = loadIntentionsFromLocalStorage();
displayIntentions(intentionsArray);
