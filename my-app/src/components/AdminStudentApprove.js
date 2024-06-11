import React, { useState, useEffect } from 'react';
import '../admin-loginStudentApprove.css';

function WaitingStudents() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

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

  // Function to handle rejection
  const handleReject = (studentId) => {
    console.log('Rejecting student with ID:', studentId);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ student_id: studentId })
    };

    // Make the fetch request to the backend
    fetch('http://15.206.160.1:3000/rejected_student', options)
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
        console.error('Error rejecting student:', error);
        alert('Error rejecting student: ' + error.message);
      });
  };

  // Handle select/deselect of students
  const handleSelect = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  // Handle bulk approval
  const handleBulkApprove = () => {
    selectedStudents.forEach(handleApprove);
  };

  // Handle bulk rejection
  const handleBulkReject = () => {
    selectedStudents.forEach(handleReject);
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
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.student_id)}
                  onChange={() => handleSelect(student.student_id)}
                />
              </td>
              <td>{student.student_id}</td>
              <td>{student.user}</td>
              <td>{student.mobile}</td>
              <td>{student.email}</td>
              <td>{student.utr}</td>
              <td>{student.date}</td>
              <td>{student.amount}</td>
              <td>{student.instituteId}</td>
              <td><button onClick={() => handleApprove(student.student_id)}>Approve</button></td>
              <td><button onClick={() => handleReject(student.student_id)}>Reject</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bulk-action-buttons">
        <button onClick={handleBulkApprove} disabled={selectedStudents.length === 0}>
          Approve Selected
        </button>
        <button onClick={handleBulkReject} disabled={selectedStudents.length === 0}>
          Reject Selected
        </button>
      </div>
    </div>
  );
}

export default WaitingStudents;