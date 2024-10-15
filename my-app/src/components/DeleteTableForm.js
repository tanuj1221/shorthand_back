import React, { useState } from 'react';
import axios from 'axios';
import './DeleteTableForm.css';

const DeleteTableForm = () => {
    const [tableName, setTableName] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async (event) => {
        event.preventDefault();
        if (!tableName) {
            setMessage('Please enter a table name.');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:3000/deletetable/${tableName}`);
            setMessage(response.data);
            setTableName('');
        } catch (error) {
            setMessage(error.response ? error.response.data : 'Failed to delete table');
        }
    };

    return (
        <div className="delete-table-form">
            <h2 className="delete-table-form__title">Delete Table</h2>
            <form className="delete-table-form__form" onSubmit={handleDelete}>
                <div className="delete-table-form__input-group">
                    <label htmlFor="tableName" className="delete-table-form__label">Table Name:</label>
                    <input
                        type="text"
                        id="tableName"
                        className="delete-table-form__input"
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                        placeholder="Enter table name"
                    />
                </div>
                <button type="submit" className="delete-table-form__submit">Delete Table</button>
            </form>
            {message && <p className="delete-table-form__message">{message}</p>}
        </div>
    );
};

export default DeleteTableForm;