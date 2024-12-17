export function displayChatHistory(chatHistory) {
    const container = document.createElement('div');
    
    for (const row of chatHistory) {
        const uuid = row.uuid;
        const message = row.chat_message;

        const user = uuid === '59a75576-4ef2-48b4-9aa9-89d44bfc00db' ? 'erik' : 'mom';

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('chat-message');
        itemDiv.textContent = user + ': ' + message;

        container.appendChild(itemDiv);
    }

    document.body.appendChild(container);
}
