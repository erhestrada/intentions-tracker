export function displayChatHistory(chatHistory) {
    const existingContainer = document.getElementById('chat-messages-container');
    if (existingContainer) {
        existingContainer.remove(); // Remove the existing container
    }

    const container = document.createElement('div');
    container.id = 'chat-messages-container';
    
    for (const row of chatHistory) {
        const message = row.chat_message;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('chat-message');
        itemDiv.textContent = message;

        container.appendChild(itemDiv);
    }

    document.body.appendChild(container);
}
