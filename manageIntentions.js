import { loadIntentionsFromLocalStorage, addIntention } from "./addIntention";
import { displayIntentions } from "./displayIntentions";

const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addIntention();
  });

const deleteButton = document.getElementById('delete-intentions-button');

document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('intention') && deleteButton.clicked) {
        event.target.remove();
    }
});

const intentionsArray = loadIntentionsFromLocalStorage();
displayIntentions(intentionsArray);

setTimeout(() => {
    const intentions = document.querySelectorAll('.intention');

      deleteButton.addEventListener('click', () => {
        deleteButton.clicked = !deleteButton.clicked;
        intentions.forEach((intention) => {
          intention.classList.toggle('clickable');
        });
      });
    

}, 0);


  

