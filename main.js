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
        caret.style.left = `${currentIndex * 15}px`; // adjust caret position
        currentIndex++;
        if (currentIndex === originalText.length) {
            // success
            alert('Success!');
            document.removeEventListener('keydown', this);
        }
    }
});

// initial caret position
caret.style.left = '0px';
caret.style.top = `${textToType.offsetTop + 5}px`; // adjust caret vertical position