import React from 'react';
import { Link } from 'react-router-dom';
import TablesList from './TableList';
import DeleteTableForm from './DeleteTableForm';
import UpdateTable from './UpdateTable';
import WaitingStudents from './AdminStudentApprove';

import FileUpload from './FileUpload'; // Adjust the import path as necessary

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <TablesList />
      <FileUpload />
     
      <DeleteTableForm />
      <UpdateTable />
      <br></br>

      <h1>student approve</h1>
      <WaitingStudents />
    </div>
  );
}

export default AdminDashboard;