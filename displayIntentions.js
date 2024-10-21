export function displayIntentions(intentions) {
    for (const intention of intentions) {
        const element = document.createElement('p');
        element.innerText = intention;
        document.body.appendChild(element);
    }
}