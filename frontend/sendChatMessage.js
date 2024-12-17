import { retrieveChatHistory } from "./retrieveChatHistory";

export async function sendChatMessage(uuid) {
    const chatHistory = await retrieveChatHistory();
    //displayChatHistory(chatHistory);

    const chatMessage = document.getElementById('send-chat-message-input').value;
    console.log(chatMessage);
    
}


export function addIntention(uuid) {
  //let requiredRepetitionsPerIntention = JSON.parse(localStorage.getItem('requiredRepetitionsPerIntention')) || {};
  let requiredRepetitionsPerIntention = retrieveRequiredRepetitionsPerIntention(uuid);
  const intention = document.getElementById('add-intention-input').value.trim();
  const requiredRepetitions = document.getElementById('required-repetitions-input').value;
  requiredRepetitionsPerIntention[intention] = requiredRepetitions;
  //localStorage.setItem('requiredRepetitionsPerIntention', JSON.stringify(requiredRepetitionsPerIntention));
  storeRequiredRepetitionsForIntention(uuid, intention, requiredRepetitions);

  displaySquares({[intention]: requiredRepetitions});
  document.getElementById('add-intention-input').value = ''; // clear input when intention added
}
