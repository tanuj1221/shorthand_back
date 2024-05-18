import React from 'react';
import { useEffect, useState } from 'react';
import LoginComponent from './components/InstituteLogin';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import InstituteDashboard from './components/InstituteDashboard';
import StudentForm from './components/StudentForm'; // Renamed for clarity
import StudentList from './components/StudentList';
import PayStudentList from './components/PayStudentList';
import EditStudentForm from './components/EditStudentForm';
import Dashboard from './components/Dashboard';
import AdminLoginComponent from './components/AdminLoginComponent';
import AdminDashboard from './components/AdminDashboard';
axios.defaults.withCredentials = true;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);  // shubh: set it back to false
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // shubh: set it back to
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://3.110.77.175:3000/check-auth')
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
        console.log("isAuthenticated: "+response.data.isAuthenticated);
      })
      .catch(() => {
        setIsAuthenticated(true); //shubh: set it back to false
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get('http://3.110.77.175:3000/check-admin')
      .then(response => {
        setIsAdminAuthenticated(response.data.isAdminAuthenticated);
        console.log(response.data.isAdminAuthenticated);
      })
      .catch(() => {
        setIsAdminAuthenticated(true);//shubh: set it back to false
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  

  if (loading) {
    return <div>Loading...</div>; 
  }

  return ( 
    <Router>
      <Routes>
      /*<Route path="/admin" element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin_login" />} />*/
      <Route path="/admin" element={isAdminAuthenticated ? <AdminDashboard /> : <AdminDashboard />} />
       <Route path="/admin_login" element={isAdminAuthenticated ? <Navigate to="/admin" /> : <AdminLoginComponent setIsAdminAuthenticated={setIsAdminAuthenticated} />} />
       <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login_institute" />} />
        <Route path="/login_institute" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginComponent setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <InstituteDashboard setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/login_institute" />}>
          <Route path="students" element={<StudentList />} />
          <Route path="registration" element={<StudentForm />} />
          <Route path="paystudents" element={<PayStudentList />} />
          <Route path="overview" element={<Dashboard/>}></Route>
          <Route path="edit-student/:id" element={<EditStudentForm />} />
        </Route>  
      </Routes>
    </Router>
  );
};

export default App;