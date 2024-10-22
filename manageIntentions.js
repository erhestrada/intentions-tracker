import { addIntention } from "./addIntention";

const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addIntention();
  });