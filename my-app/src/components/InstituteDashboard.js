import React, { useState } from 'react';
import '../InstituteDashboard.css';
import logo from '../images/GCC-TBC.png'; // Import the logo image
import LoginForm from './StudentForm';
import StudentList from './StudentList';
import PayStudentList from './PayStudentList';
import { Link, Route, Routes } from 'react-router-dom';
import { Outlet } from 'react-router-dom';


const InstituteDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div class={`body ${isDarkMode ? 'dark' : ''}`}>
      <nav class="navbar">
        <div class="logo">
          <img src={logo} alt="logo" />
          <div style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', display: 'block', alignItems: 'center',fontWeight:'bold' }}>
            <span>MSCE PUNE COMPUTER SHORTHAND DEMO</span> 
          </div>
        </div>
        <ul class="menu-links">
          <li class="nav-link">
            <Link to="registration">
              <span>Registration Form</span>
            </Link>
          </li>
          <li class="nav-link">
            <Link to="students">
              <span>Students List</span>
            </Link>
          </li>
          <li class="nav-link">
            <Link to="paystudents">
              <span>Pay fees</span>
            </Link>
          </li>
        </ul>
        <div class="nav-link">
        <Link to="/login_institute">
            <span>Log Out</span>
          </Link>
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/registration" element={<LoginForm />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/paystudents" element={<PayStudentList />} />
        </Routes>
      </div>
    </div>
  );
};

export default InstituteDashboard;