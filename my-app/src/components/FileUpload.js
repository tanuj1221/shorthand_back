import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

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
      const response = await axios.post(`http://shorthandexam.in/api/import-csv/${tableName}`, formData, {
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
    <div className="file-upload">
      <h2 className="file-upload__title">Upload CSV to Table</h2>
      <form className="file-upload__form" onSubmit={handleUpload}>
        <div className="file-upload__input-group">
          <label htmlFor="file-input" className="file-upload__label">Choose CSV File:</label>
          <input 
            id="file-input"
            className="file-upload__file-input" 
            type="file" 
            onChange={handleFileChange} 
            accept=".csv" 
          />
        </div>
        <div className="file-upload__input-group">
          <label htmlFor="table-name" className="file-upload__label">Table Name:</label>
          <input 
            id="table-name"
            className="file-upload__text-input" 
            type="text" 
            value={tableName} 
            onChange={handleTableNameChange} 
            placeholder="Enter table name" 
          />
        </div>
        <button className="file-upload__submit" type="submit">Upload</button>
      </form>
      {uploadStatus && <p className="file-upload__status">{uploadStatus}</p>}
    </div>
  );
}

export default FileUpload;