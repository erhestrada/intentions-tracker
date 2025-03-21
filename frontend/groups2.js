import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveGroups, retrieveGroupsForUser } from "./storeAndRetrieveGroups";

// script.js
function openTab(event, tabName) {
  // Hide all tab content
  var tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(function(content) {
    content.classList.remove('active');
  });

  // Remove 'active' class from all tab links
  var tabLinks = document.querySelectorAll('.tab-link');
  tabLinks.forEach(function(link) {
    link.classList.remove('active');
  });

  // Show the current tab content
  document.getElementById(tabName).classList.add('active');

  // Add 'active' class to the clicked tab link
  event.currentTarget.classList.add('active');
}
  
// Default open the first tab (Article)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.tab-link').click();
});

const uuid = getOrCreateUniqueId();
const groupsForUser = await retrieveGroupsForUser(uuid);
const groups = await retrieveGroups();

console.log('hello');
const myGroupsContainer = document.getElementById('my-groups-container');

const groupElement = document.createElement('p');
groupElement.innerText = groupsForUser[0].group_name;

myGroupsContainer.appendChild(groupElement);

const searchGroupsContainer = document.getElementById('search-groups-container');

const searchGroupsElement = document.createElement('p');
searchGroupsElement.innerText = groups[0].group_name;

searchGroupsContainer.appendChild(searchGroupsElement);

const myGroupsTab = document.getElementById('my-groups-tab');
const searchGroupsTab = document.getElementById('search-groups-tab');

myGroupsTab.addEventListener('click', (event) => {
  openTab(event, 'my-groups-container')
  console.log(groupsForUser);
  
});

searchGroupsTab.addEventListener('click', (event) => {
  openTab(event, 'search-groups-container')
  console.log(groups);
});