import { loadIntentionsFromLocalStorage, saveDataToLocalStorage} from "./addIntention";

export function removeIntentionFromLocalStorage(intentionToRemove) {
    let intentions = loadIntentionsFromLocalStorage();
    intentions = intentions.filter((intention) => intention!==intentionToRemove);
    saveDataToLocalStorage('intentions', intentions);
    return intentions
}