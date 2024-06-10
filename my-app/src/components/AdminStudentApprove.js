import React, { useState, useEffect } from 'react';
import '../admin-loginStudentApprove.css';

function WaitingStudents() {
  const [students, setStudents] = useState([]);

  // Fetch students on component mount
  useEffect(() => {
    fetch('http://15.206.160.1:3000/approve') // Ensure this URL matches your actual API endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  // Function to handle approval
  const handleApprove = (studentId) => {
    console.log('Approving student with ID:', studentId);
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ student_id: studentId })
    };
  
    // Make the fetch request to the backend
    fetch('http://15.206.160.1:3000/approved_student', options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);
        alert(data.message);
      })
      .catch(error => {
        console.error('Error approving student:', error);
        alert('Error approving student: ' + error.message);
      });
  };

  return (
    <div>
      <h1>Waiting Students</h1>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>UTR</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Institute ID</th>
            <th>Approve</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td><input type="checkbox" /></td>
              <td>{student.student_id}</td>
              <td>{student.user}</td>
              <td>{student.mobile}</td>
              <td>{student.email}</td>
              <td>{student.utr}</td>
              <td>{student.date}</td>
              <td>{student.amount}</td>
              <td>{student.instituteId}</td>
              <td><button onClick={() => handleApprove(student.student_id)}>Approve</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WaitingStudents;