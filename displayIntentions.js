export function displayIntentions(intentions) {
    for (const intention of intentions) {
        displayIntention(intention);
    }
}

export function displayIntention(intention) {
    const element = document.createElement('p');
    element.innerText = intention;
    element.className = "intention";
    document.body.appendChild(element);
}