import React from 'react';
import { Link } from 'react-router-dom';
import TablesList from './TableList';
import DeleteTableForm from './DeleteTableForm';

import FileUpload from './FileUpload'; // Adjust the import path as necessary

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <TablesList />
      <FileUpload />
     
      <DeleteTableForm />
    </div>
  );
}

export default AdminDashboard;