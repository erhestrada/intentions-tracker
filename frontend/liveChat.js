import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveUsername } from "./storeAndRetrieveUsername";
const uuid = getOrCreateUniqueId();
const username = await retrieveUsername(uuid);

const socket = io('http://localhost:3000'); // Make sure this points to your backend

// DOM elements
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const messages = document.getElementById('messages');

// Send message when button is clicked
sendButton.addEventListener('click', () => {
  const message = username + ': ' + input.value;
  if (message.trim()) {
    socket.emit('chat message', message); // Send message to the server
    input.value = ''; // Clear the input field
  }
});

// Listen for incoming messages
socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.textContent = msg;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
});

// Allow pressing Enter to send a message
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});
