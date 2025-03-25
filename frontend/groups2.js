import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveGroups, retrieveGroupsForUser, retrieveUsersForGroup } from "./storeAndRetrieveGroups";

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
  
async function setUp() {
  const uuid = getOrCreateUniqueId();
  const groupsForUser = await retrieveGroupsForUser(uuid);
  const groups = await retrieveGroups();
  
  const myGroupsContainer = document.getElementById('my-groups-container');
  displayGroups(groupsForUser, myGroupsContainer);
  
  const searchGroupsContainer = document.getElementById('search-groups-container');
  displayGroups(groups, searchGroupsContainer);
}

async function displayGroups(groups, parentContainer) {
  for(const group of groups) {
    const groupId = group.id;
    const usersForGroup = await retrieveUsersForGroup(groupId);

    const groupElement = document.createElement('a');
    groupElement.className = 'clickable';
    groupElement.style.display = 'block';
    groupElement.style.marginBottom = "10px";
    groupElement.href = `groups.html?groupid=${groupId}`;
    groupElement.innerText = group.group_name;
    parentContainer.appendChild(groupElement);
  }
}

const myGroupsTab = document.getElementById('my-groups-tab');
const searchGroupsTab = document.getElementById('search-groups-tab');

myGroupsTab.addEventListener('click', (event) => {
  openTab(event, 'my-groups-container')
  //console.log(groupsForUser);
  
});

searchGroupsTab.addEventListener('click', (event) => {
  openTab(event, 'search-groups-container')
  //console.log(groups);
});

setUp();

myGroupsTab.click();