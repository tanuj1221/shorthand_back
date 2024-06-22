import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TablesList() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://65.0.31.147:3000/tables', {
          // Make sure to include the appropriate headers or authentication tokens
          headers: {
            Authorization: 'Bearer your-auth-token' // Adjust based on your authentication method
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

  if (loading) return <p>Loading tables...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Database Tables</h2>
      <ul>
        {tables.map((table, index) => (
          <li key={index}>{table}</li>
        ))}
      </ul>
    </div>
  );
}

export default TablesList;