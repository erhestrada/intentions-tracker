export function displayChatHistory(chatHistory) {
    const existingContainer = document.getElementById('chat-messages-container');
    
    // Clear the existing content of the chat container
    existingContainer.innerHTML = '';

    // Loop through the chat history and add each message
    for (const row of chatHistory) {
        const message = row.chat_message;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('chat-message');
        itemDiv.textContent = message;

        // Append the new message to the container
        existingContainer.appendChild(itemDiv);
    }

    // Scroll to the bottom of the chat messages container
    existingContainer.scrollTop = existingContainer.scrollHeight;
}