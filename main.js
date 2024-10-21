const container = document.querySelector('.container');

const textToTypeElement = document.createElement('span');
textToTypeElement.id = 'text-to-type';
textToTypeElement.textContent = "this is another example that should be type again so try this out";

const caretElement = document.createElement('span');
caretElement.id = 'caret';
caretElement.className = 'caret';

container.appendChild(textToTypeElement);
container.appendChild(caretElement);

const textToType = document.getElementById('text-to-type');

const originalText = textToType.textContent;
let currentIndex = 0;

function getTextWidth(text) {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.fontSize = '24px'; // Make sure this matches your CSS
    tempSpan.style.fontFamily = getComputedStyle(textToType).fontFamily;
    tempSpan.style.whiteSpace = 'pre'; // Preserve spaces
    tempSpan.textContent = text;
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);
    return width;
}

function updateText() {
    textToType.innerHTML = '';
    for (let i = 0; i < originalText.length; i++) {
        const span = document.createElement('span');
        span.textContent = originalText[i];
        span.style.color = i < currentIndex ? '#000' : '#ccc';
        /*
        if (originalText[i] === ' ') {
            span.style.backgroundColor = i < currentIndex ? '#e0e0e0' : 'transparent';
        }
        */
        textToType.appendChild(span);
    }
}

function updateCaret() {
    const caret = document.getElementById('caret');
    const typedText = originalText.substring(0, currentIndex);
    const caretOffset = getTextWidth(typedText);
    caret.style.left = `${textToType.offsetLeft + caretOffset}px`;
}

document.addEventListener('keydown', (e) => {
    if (e.key === originalText[currentIndex]) {
        currentIndex++;
        updateText();
        updateCaret();

        if (currentIndex === originalText.length) {
            alert('Success!');
            document.removeEventListener('keydown', arguments.callee);
        }
    }
});

// Initial setup
updateText();
updateCaret();