import React, { useState } from 'react';
import axios from 'axios';
import logo from '../images/GCC-TBC.png';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function InstituteLogin({ setIsAuthenticated }) {
  const [instituteId, setInstituteId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login_institute/', {
        userId: instituteId,
        password: password
      });
      console.log('Logged in successfully:', response.data);
      setErrorMessage('');
      setIsAuthenticated(true);
      navigate('/dashboard/registration');
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setErrorMessage(error.response.data);
      } else if (error.request) {
        console.log(error.request);
        setErrorMessage('No response from server');
      } else {
        console.log('Error', error.message);
        setErrorMessage('Login failed: ' + error.message);
      }
    }
  };

  return (
    <div className='centerdiv'>
      <div className="cookie-consent-container"></div>
      <div className="box">
        <span className="borderLine"></span>
        <form>
          <img className="logo" src={logo} alt="Logo" />
          <h2>Sign In</h2>
          <div id='inputBox' className="inputBox">
            <input
              type="text"
              required="required"
              value={instituteId}
              onChange={(e) => setInstituteId(e.target.value)}
            />
            <span>Username</span>
            <i></i>
          </div>
          <div id='inputPass' className="inputBox">
            <input
              type="password"
              required="required"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i></i>
          </div>
          <div className="links"></div>
          <input type="submit" value="Login" onClick={handleLogin} />
        </form>
      </div>
      {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
      <div className="copyright">&copy; 2023</div>
    </div>
  );
}

export default InstituteLogin;