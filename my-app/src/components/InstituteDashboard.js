import React, { useState } from 'react';
import '../InstituteDashboard.css';
import logo from '../images/GCC-TBC.png'; // Import the logo image
// import LoginForm from './StudentForm';
// import StudentList from './StudentList';
// import PayStudentList from './PayStudentList';
// import Dashboard from './Dashboard'; // Import the Dashboard component
import { Link, Outlet } from 'react-router-dom';


const InstituteDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to close the sidebar if it is open
  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" />
          <div className="text-normal" style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', display: 'block', alignItems: 'center', fontWeight: 'bold' }}>
            <span>MSCE PUNE COMPUTER SHORTHAND DEMO</span>
            <div className="institute-info">
              15001 ABC Comouter Typing Institute
            </div>
          </div>
        </div>
        <ul className={`menu-links ${isSidebarOpen ? 'open' : ''}`}>
          <li className="nav-link" onClick={closeSidebar}>
            <Link to="/dashboard">
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-link" onClick={closeSidebar}>
            <Link to="registration">
              <span>Registration Form</span>
            </Link>
          </li>
          <li className="nav-link" onClick={closeSidebar}>
            <Link to="students">
              <span>Students List</span>
            </Link>
          </li>
          <li className="nav-link" onClick={closeSidebar}>
            <Link to="paystudents">
              <span>Pay fees</span>
            </Link>
          </li>
        </ul>
        <div className="nav-link">
          <div className="menu-container">
            <Link to="/login_institute" className="logout-link" onClick={closeSidebar}>
              <span>Log Out</span>
            </Link>
            <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default InstituteDashboard;