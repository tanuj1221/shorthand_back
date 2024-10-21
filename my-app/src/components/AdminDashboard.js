import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TablesList from './TableList';
import DeleteTableForm from './DeleteTableForm';
import UpdateTable from './UpdateTable';
import WaitingStudents from './AdminStudentApprove';
import FileUpload from './FileUpload';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('tables');
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeSection) {
      case 'tables':
        return <TablesList />;
      case 'fileUpload':
        return <FileUpload />;
      case 'deleteTable':
        return <DeleteTableForm />;
      case 'updateTable':
        return <UpdateTable />;
      case 'approveStudents':
        return <WaitingStudents />;
      default:
        return <TablesList />;
    }
  };

  const handleLogout = () => {

    
    navigate('/admin_login'); // Redirect to login page
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Admin Dashboard</h1>
        <button className="admin-dashboard__logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <nav className="admin-dashboard__nav">
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'tables' ? 'active' : ''}`}
          onClick={() => setActiveSection('tables')}
        >
          Tables List
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'fileUpload' ? 'active' : ''}`}
          onClick={() => setActiveSection('fileUpload')}
        >
          File Upload
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'deleteTable' ? 'active' : ''}`}
          onClick={() => setActiveSection('deleteTable')}
        >
          Delete Table
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'updateTable' ? 'active' : ''}`}
          onClick={() => setActiveSection('updateTable')}
        >
          Update Table
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'approveStudents' ? 'active' : ''}`}
          onClick={() => setActiveSection('approveStudents')}
        >
          Approve Students
        </button>
      </nav>
      <main className="admin-dashboard__content">
        {renderSection()}
      </main>
    </div>
  );
}

export default AdminDashboard;