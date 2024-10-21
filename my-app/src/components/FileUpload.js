import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [tableName, setTableName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTableNameChange = (event) => {
    setTableName(event.target.value);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !tableName) {
      setUploadStatus('Please select a file and enter a table name.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFilePath', file);

    try {
      const response = await axios.post(`http://localhost:3000/api/import-csv/${tableName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadStatus('File uploaded successfully: ' + response.data.message);
    } catch (error) {
      setUploadStatus('Error uploading file: ' + (error.response?.data.error || error.message));
    }
  };

  return (
    <div>
      <h2>Upload CSV to Table</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <input type="text" value={tableName} onChange={handleTableNameChange} placeholder="Enter table name" />
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

export default FileUpload;