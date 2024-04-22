import React, { useState, useEffect } from 'react';
import '../InstituteDashboard.css';
import logo from '../images/GCC-TBC.png';
import { Link, Outlet } from 'react-router-dom';

const InstituteDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [instituteName, setInstituteName] = useState('Loading Institute...'); // Initial placeholder
  const [instituteId, setInstituteId] = useState('Loading ID');

  useEffect(() => {
    // Retrieve the instituteName from localStorage
    const storedInstituteName = localStorage.getItem('instituteName');
    const storedInstituteId = localStorage.getItem('instituteId');

    if (storedInstituteName) {
      setInstituteName(storedInstituteName);
    } else {
      setInstituteName('Institute Name Not Found'); // Fallback text
    }

    if (storedInstituteId) {
      setInstituteId(storedInstituteId);
    } else {
      setInstituteId('ID Not Found');
    }
  }, []); // Empty dependency array ensures this runs only once at mount

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
              {instituteId}-{instituteName} {/* Display the dynamic institute name */}
            </div>
          </div>
        </div>
        <ul className={`menu-links ${isSidebarOpen ? 'open' : ''}`}>
          <li className="nav-link" onClick={closeSidebar}>
            <Link to="overview">
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