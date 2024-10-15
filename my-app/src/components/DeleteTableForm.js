import React, { useState } from 'react';
import axios from 'axios';

const DeleteTableForm = () => {
    const [tableName, setTableName] = useState(''); // State to hold the input value
    const [message, setMessage] = useState(''); // State to display messages to the user

    const handleDelete = async (event) => {
        event.preventDefault(); // Prevent form from causing a page reload
        if (!tableName) {
            setMessage('Please enter a table name.');
            return;
        }

        try {
            const response = await axios.delete(`http://13.235.95.5:3000/deletetable/${tableName}`);
            setMessage(response.data); // Display success message
            setTableName(''); // Reset table name input
        } catch (error) {
            setMessage(error.response ? error.response.data : 'Failed to delete table'); // Display error message
        }
    };

    return (
        <div>
            <form onSubmit={handleDelete}>
                <label htmlFor="tableName">Table Name:</label>
                <input
                    type="text"
                    id="tableName"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="Enter table name"
                />
                <button type="submit">Delete Table</button>
            </form>
            {message && <p>{message}</p>} {/* Display messages to the user */}
        </div>
    );
};

export default DeleteTableForm;