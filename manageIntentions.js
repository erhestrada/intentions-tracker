import { addIntention } from "./addIntention";
import { displayIntentions } from "./displayIntentions";
import { displayObjectAsTable } from "./displayObjectAsTable";
import { removeIntentionFromLocalStorage } from "./removeIntentionFromLocalStorage";

const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addIntention();
  });

const deleteButton = document.getElementById('delete-intentions-button');
deleteButton.clicked = false;

document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('intention') && deleteButton.clicked) {
        const intention = event.target.textContent;
        removeIntentionFromLocalStorage(intention);
        event.target.remove();
    }
});

deleteButton.addEventListener('click', () => {
    deleteButton.clicked = !deleteButton.clicked;
    const intentions = document.querySelectorAll('.intention');
    intentions.forEach((intention) => {
        intention.classList.toggle('clickable');
    });
});

//const intentionsArray = loadIntentionsFromLocalStorage();
const requiredRepetitionsPerIntention = JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {};
//displayIntentions(intentionsArray);
displayObjectAsTable(requiredRepetitionsPerIntention, 'intentions', 'repetitions per day');
