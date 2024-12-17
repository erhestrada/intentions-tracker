import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { sendChatMessage } from "./sendChatMessage";

const uuid = getOrCreateUniqueId();
const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendChatMessage(uuid);
  });

const chatHistory = await retrieveChatHistory();
displayChatHistory(chatHistory);
