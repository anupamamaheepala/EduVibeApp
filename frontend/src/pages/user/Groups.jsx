import React, { useState } from 'react';

const Groups = () => {
    // State to store groups
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState('');

    // Function to handle group name input change
    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    // Function to add a new group
    const handleAddGroup = () => {
        if (groupName.trim() !== '') {
            setGroups([...groups, groupName]);
            setGroupName('');
        }
    };

    // Function to handle deletion of a group
    const handleDeleteGroup = (groupToDelete) => {
        setGroups(groups.filter(group => group !== groupToDelete));
    };

    return (
        <div>
            <h2>Groups</h2>
            <input
                type="text"
                value={groupName}
                onChange={handleGroupNameChange}
                placeholder="Enter group name"
            />
            <button onClick={handleAddGroup}>Add Group</button>

            <h3>Group List</h3>
            <ul>
                {groups.map((group, index) => (
                    <li key={index}>
                        {group} 
                        <button onClick={() => handleDeleteGroup(group)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Groups;
