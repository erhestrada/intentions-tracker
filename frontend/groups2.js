import { getOrCreateUniqueId } from "./getOrCreateUniqueUserId";
import { retrieveGroupsForUser } from "./storeAndRetrieveGroups";

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
  
  const myGroupsTab = document.getElementById('my-groups-tab');
  const searchGroupsTab = document.getElementById('search-groups-tab');
  
  myGroupsTab.addEventListener('click', async (event) => {
    openTab(event, 'article')
    const groups = await retrieveGroupsForUser(uuid);
    console.log(groups);
  });

  searchGroupsTab.addEventListener('click', (event) => {
    openTab(event, 'talk')
  });