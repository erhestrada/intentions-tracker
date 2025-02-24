// like the home page, excxept no typeIntentions, and the uuid is from the user that was clicked on

const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('uuid');
