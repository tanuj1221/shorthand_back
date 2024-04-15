import React from 'react';
import { useEffect, useState } from 'react';
import LoginComponent from './components/InstituteLogin';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import InstituteDashboard from './components/InstituteDashboard';
import LoginForm from './components/StudentForm';
import StudentList from './components/StudentList';
import PayStudentList from './components/PayStudentList';

axios.defaults.withCredentials = true;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/check-auth')
      .then(response => {
        setIsAuthenticated(response.data.isAuthenticated);
        console.log(response.data.isAuthenticated);
      })
      .catch(() => {
        setIsAuthenticated(false);
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
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login_institute" />} />
        <Route path="/login_institute" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginComponent setIsAuthenticated={setIsAuthenticated} />} />        <Route path="/dashboard" element={isAuthenticated ? <InstituteDashboard /> : <Navigate to="/login_institute" />}>
          <Route path="students" element={<StudentList />} />
          <Route path="registration" element={<LoginForm />} />
          <Route path="paystudents" element={<PayStudentList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;