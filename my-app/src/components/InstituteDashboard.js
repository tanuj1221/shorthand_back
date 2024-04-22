import React, { useState, useEffect } from 'react';
import '../InstituteDashboard.css';
import logo from '../images/GCC-TBC.png';
import { Link, Outlet } from 'react-router-dom';

const InstituteDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [instituteName, setInstituteName] = useState('Loading Institute...'); // Initial placeholder
  const [instituteId, setInstituteId] = useState('Loading ID');

  useEffect(() => {
    // Assuming the endpoint to fetch institute details is '/api/institute/details'
    fetch('http://3.110.77.175:3000/institutedetails', {
      method: 'GET',
      headers: {
        // Assuming you are using sessions or token based authentication
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch institute details');
      }
      return response.json();
    })
    .then(data => {
      setInstituteName(data.InstituteName || 'Institute Name Not Found');
      setInstituteId(data.instituteId || 'ID Not Found');
    })
    .catch(error => {
      console.error('Error fetching institute details:', error);
      setInstituteName('Error loading institute name');
      setInstituteId('Error loading ID');
    });
  }, []);

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