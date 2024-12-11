import { typeIntentions, handleKeydown } from "./typeIntentions";
import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveRequiredRepetitionsPerIntention } from "./retrieveRequiredRepetitionsPerIntention";

const userId = getOrCreateUniqueId();
const intentions = Object.keys(JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {});
const intentions2 = await retrieveRequiredRepetitionsPerIntention();
console.log('intention2', intentions2);
console.log('intentions', intentions);
document.addEventListener('keydown', (e) => handleKeydown(e, intentions));
typeIntentions(intentions);
