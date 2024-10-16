import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablesList from './TableList';
import DeleteTableForm from './DeleteTableForm';
import UpdateTable from './UpdateTable';
import WaitingStudents from './AdminStudentApprove';
import FileUpload from './FileUpload';
import PaidStudents from './PaidStudents';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('tables');
  const [menuOpen, setMenuOpen] = useState(false);
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
      case 'paidStudents':
        return <PaidStudents />;
      default:
        return <TablesList />;
    }
  };

  const handleLogout = () => {
    navigate('/admin-login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Admin Dashboard</h1>
        <button className="admin-dashboard__logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="admin-dashboard__menu-btn" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      <nav className={`admin-dashboard__nav ${menuOpen ? 'open' : ''}`}>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'tables' ? 'active' : ''}`}
          onClick={() => handleNavClick('tables')}
        >
          Tables List
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'fileUpload' ? 'active' : ''}`}
          onClick={() => handleNavClick('fileUpload')}
        >
          File Upload
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'deleteTable' ? 'active' : ''}`}
          onClick={() => handleNavClick('deleteTable')}
        >
          Delete Table
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'updateTable' ? 'active' : ''}`}
          onClick={() => handleNavClick('updateTable')}
        >
          Update Table
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'approveStudents' ? 'active' : ''}`}
          onClick={() => handleNavClick('approveStudents')}
        >
          Approve Students
        </button>
        <button
          className={`admin-dashboard__nav-button ${activeSection === 'paidStudents' ? 'active' : ''}`}
          onClick={() => handleNavClick('paidStudents')}
        >
          Paid Students
        </button>
      </nav>
      <main className="admin-dashboard__content">
        {renderSection()}
      </main>
    </div>
  );
}

export default AdminDashboard;