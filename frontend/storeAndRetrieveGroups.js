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
