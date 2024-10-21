import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TablesList.css';

function TablesList() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://shorthandexam.in/tables', {
          headers: {
            Authorization: 'Bearer your-auth-token'
          }
        });
        setTables(response.data.tables);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tables: ' + err.message);
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) return <p className="tables-list__loading">Loading tables...</p>;
  if (error) return <p className="tables-list__error">Error: {error}</p>;

  return (
    <div className="tables-list">
      <h2 className="tables-list__title">Database Tables</h2>
      <ul className="tables-list__list">
        {tables.map((table, index) => (
          <li key={index} className="tables-list__item">{table}</li>
        ))}
      </ul>
    </div>
  );
}

export default TablesList;