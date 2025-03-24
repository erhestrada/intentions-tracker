export async function storeGroup(uuid, groupName, groupDescription) {
    try {
        const response = await fetch('http://192.168.86.195:3000/storeGroup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ uuid, groupName, groupDescription })
        });
        const result = await response.json();
        console.log('Group stored', result);

        // After storing the group, call the next function to store the relationship
        const groupId = result.group_id;  // Assuming `group_id` is part of the response
        await storeGroupsPerUser(uuid, groupId);  // Use the group_id from the response

    } catch(error) {
        console.error("Error storing group: ", error);
    }
}

// Second, store the relationship in the groups_per_user join table
export async function storeGroupsPerUser(uuid, groupId) {
    try {
        const response = await fetch('http://192.168.86.195:3000/storeGroupsPerUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ uuid, groupId })
        });
        const result = await response.json();
        console.log('Group-user relationship stored', result);

    } catch (error) {
        console.error("Error storing group-user relationship: ", error);
    }
}

export async function retrieveGroupsForUser(uuid) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveGroupsForUser?uuid=${encodeURIComponent(uuid)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error retrieving groups for user:', error);
    }
}

export async function retrieveGroups() {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveGroups`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error retrieving groups for user:', error);
    }
}

export async function retrieveUsersForGroup(groupId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/retrieveUsersForGroup?groupId=${encodeURIComponent(groupId)}`);
        const data = await response.json();
        const users = data.map(entry => entry.uuid);
        return users;
    } catch (error) {
        console.error('Error retrieving users for group:', error);
    }
}