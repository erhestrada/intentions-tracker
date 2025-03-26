import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveUsername } from "./storeAndRetrieveUsername";
import { storeChatMessage } from "./storeChatMessage";
import { retrieveChatHistory } from "./retrieveChatHistory";
import { displayChatHistory } from "./displayChatHistory";

const chatHistory = await retrieveChatHistory();
displayChatHistory(chatHistory);

const uuid = getOrCreateUniqueId();
const username = await retrieveUsername(uuid);

const socket = io('http://localhost:3000'); // Make sure this points to your backend

// DOM elements
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const messages = document.getElementById('chat-messages-container');

// Send message when button is clicked
sendButton.addEventListener('click', async () => {
  const message = input.value;
  if (message.trim()) {
    const messageWithUsername = username + ': ' + input.value;
    await storeChatMessage(uuid, messageWithUsername);
    socket.emit('chat message', messageWithUsername); // Send message to the server
    input.value = ''; // Clear the input field
  }
});

// Listen for incoming messages
socket.on('chat message', (msg) => {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('chat-message');
  itemDiv.textContent = msg;

  messages.appendChild(itemDiv);
  messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
});

// Allow pressing Enter to send a message
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});
