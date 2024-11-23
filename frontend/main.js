import { typeIntentions, handleKeydown } from "./typeIntentions";

const intentions = Object.keys(JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {});
console.log(intentions);
document.addEventListener('keydown', (e) => handleKeydown(e, intentions));
typeIntentions(intentions);
