import React, { useState, useEffect } from 'react';
import './AdminStudentApprove.css';

function WaitingStudents() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/approve')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then(data => setStudents(data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const handleApprove = (studentId) => {
    console.log('Approving student with ID:', studentId);
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ student_id: studentId })
    };
  
    fetch('http://localhost:3000/approved_student', options)
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

  const handleReject = (studentId) => {
    console.log('Rejecting student with ID:', studentId);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ student_id: studentId })
    };

    fetch('http://localhost:3000/rejected_student', options)
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

  const handleSelect = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleBulkApprove = () => {
    selectedStudents.forEach(handleApprove);
  };

  const handleBulkReject = () => {
    selectedStudents.forEach(handleReject);
  };

  return (
    <div className="waiting-students-2024">
      <h1 className="waiting-students-2024__title">Waiting Students</h1>
      <div className="waiting-students-2024__table-container">
        <table className="waiting-students-2024__table">
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
              <th>Actions</th>
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
                    className="waiting-students-2024__checkbox"
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
                <td>
                  <button onClick={() => handleApprove(student.student_id)} className="waiting-students-2024__button waiting-students-2024__button--approve">Approve</button>
                  <button onClick={() => handleReject(student.student_id)} className="waiting-students-2024__button waiting-students-2024__button--reject">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="waiting-students-2024__bulk-actions">
        <button onClick={handleBulkApprove} disabled={selectedStudents.length === 0} className="waiting-students-2024__button waiting-students-2024__button--bulk waiting-students-2024__button--approve">
          Approve Selected
        </button>
        <button onClick={handleBulkReject} disabled={selectedStudents.length === 0} className="waiting-students-2024__button waiting-students-2024__button--bulk waiting-students-2024__button--reject">
          Reject Selected
        </button>
      </div>
    </div>
  );
}

export default WaitingStudents;