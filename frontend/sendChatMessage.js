import { retrieveChatHistory } from "./retrieveChatHistory";
import { storeChatMessage } from "./storeChatMessage";
import { displayChatHistory } from "./displayChatHistory";

export async function sendChatMessage(uuid) {
    const chatMessage = document.getElementById('send-chat-message-input').value;
    await storeChatMessage(uuid, chatMessage);

    const chatHistory = await retrieveChatHistory();
    displayChatHistory(chatHistory);
}
