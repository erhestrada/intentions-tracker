import { loadIntentionsFromLocalStorage, addIntention } from "./addIntention";
import { displayIntentions } from "./displayIntentions";

const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addIntention();
  });

const intentionsArray = loadIntentionsFromLocalStorage();
displayIntentions(intentionsArray);

const deleteButton = document.getElementById('delete-intentions-button');
setTimeout(() => {
    const intentions = document.querySelectorAll('.intention');

    const intentionClickHandler = (event) => {
        event.target.remove();
      };

    deleteButton.addEventListener('click', () => {
        intentions.forEach((intention) => {
            intention.classList.toggle('clickable');
            if (intention.classList.contains('clickable')) {
                intention.addEventListener('click', intentionClickHandler);
            } else {
                intention.removeEventListener('click', intentionClickHandler);
            }
        });
    });

}, 0);


