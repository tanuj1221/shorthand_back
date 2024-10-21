import React, { useState, useEffect } from 'react';


function PaidStudents() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetch('http://shorthandexam.in/paid-students')
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
  
    fetch('http://shorthandexam.in/approved_student', options)
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

    fetch('http://shorthandexam.in/rejected_student', options)
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

  return (
    <div className="asa-container">
      <h1 className="asa-title">Paid Students</h1>
      <p className="asa-total-count">Total Paid Students: {students.length}</p>
      <div className="asa-table-container">
        <table className="asa-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>UTR</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Institute ID</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.user}</td>
                <td>{student.mobile}</td>
                <td>{student.email}</td>
                <td>{student.utr}</td>
                <td>{student.date}</td>
                <td>{student.amount}</td>
                <td>{student.instituteId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaidStudents;