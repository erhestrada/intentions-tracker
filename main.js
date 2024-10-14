const textToType = document.getElementById('text-to-type');
const inputField = document.getElementById('input-field');
const originalText = textToType.textContent;
let currentIndex = 0;

inputField.addEventListener('input', () => {
    const userText = inputField.value;
    if (userText === originalText.substring(0, userText.length)) {
        // correct typing
        textToType.innerHTML = `<span style="color:#000">${userText}</span><span style="color:#ccc">${originalText.substring(userText.length)}</span>`;
        currentIndex = userText.length;
    } else {
        // incorrect typing
        textToType.innerHTML = `<span style="color:#000">${originalText.substring(0, currentIndex)}</span><span style="color:#ccc">${originalText.substring(currentIndex)}</span>`;
    }

    if (userText === originalText) {
        // success
        textToType.classList.add('success');
        alert('Success!');
        inputField.disabled = true;
    }
});