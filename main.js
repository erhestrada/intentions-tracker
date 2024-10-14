const textToType = document.getElementById('text-to-type');
const caret = document.getElementById('caret');
const originalText = textToType.textContent;
let currentIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === originalText[currentIndex]) {
        // correct key press
        const span = document.createElement('span');
        span.textContent = originalText[currentIndex];
        textToType.innerHTML = '';
        for (let i = 0; i <= currentIndex; i++) {
            if (i === currentIndex) {
                span.style.color = '#000';
                textToType.appendChild(span);
            } else {
                const prevSpan = document.createElement('span');
                prevSpan.textContent = originalText[i];
                prevSpan.style.color = '#000';
                textToType.appendChild(prevSpan);
            }
        }
        for (let i = currentIndex + 1; i < originalText.length; i++) {
            const remainingSpan = document.createElement('span');
            remainingSpan.textContent = originalText[i];
            remainingSpan.style.color = '#ccc';
            textToType.appendChild(remainingSpan);
        }

        const fontSize = 24;
        const charWidth = fontSize * 0.5; // adjust this value as needed
        //caret.style.left = `${currentIndex * 15}px`; // adjust caret position
        //caret.style.left = `${currentIndex * charWidth}px`; /* update caret position */
        caret.style.left = `${caret.offsetLeft + charWidth}px`;

        currentIndex++;
        if (currentIndex === originalText.length) {
            // success
            alert('Success!');
            document.removeEventListener('keydown', this);
        }
    }
});

// initial caret position
caret.style.left = `${textToType.offsetLeft}px`;
//caret.style.top = `${textToType.offsetTop + 5}px`; // adjust caret vertical position