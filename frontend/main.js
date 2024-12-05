import { typeIntentions, handleKeydown } from "./typeIntentions";
import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { getUserData } from "./getUserData";

const userId = getOrCreateUniqueId();
const intentions = Object.keys(JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {});
console.log(intentions);
document.addEventListener('keydown', (e) => handleKeydown(e, intentions));
typeIntentions(intentions);
