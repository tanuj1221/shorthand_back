import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../tabel.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getstudents');
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, []);
  const handleSearch = event => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredStudents = students.filter(student => {
    return Object.values(student).some(value =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });

  const renderImage = (imageText) => {
    if (imageText) {
      const imageBytes = atob(imageText);
      const arrayBuffer = new ArrayBuffer(imageBytes.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < imageBytes.length; i++) {
        uint8Array[i] = imageBytes.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      return <img src={imageUrl} alt="Student" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
    }
    return null;
  };
  
  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(students.map(({ image, ...rest }) => rest));
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Students");
    XLSX.writeFile(workBook, "StudentData.xlsx");
  };

    const headingStyle = {
    textAlign: 'center', // Centers the text
    color: '#333', // A modern, neutral color
    fontSize: '2rem', // A larger font size for the main heading
    fontWeight: '300', // A lighter font weight for a modern look
    textTransform: 'uppercase', // Uppercase text for stylistic preference
    letterSpacing: '1px', // Spacing out letters a bit for readability
    marginBottom: '1rem', // Adding some space below the heading
    paddingTop: '20px', // Padding at the top to push the content down a bit
  };

  const searchInputStyle = {
    padding: '10px',
    width: '100%', // Use 100% width to be responsive to the container's width
    maxWidth: '200px', // Maximum width for the input
    height: '40px', // A comfortable height for desktop users
    border: '1px solid #ddd',
    borderRadius: '20px', // Rounded borders for a modern pill shape
    fontSize: '16px', // A readable font size
    color: '#333',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    outline: 'none', // Removes the default focus outline
    marginBottom: '10px', // Space below the input
  };
  
  const buttonStyle = {
    padding: '10px 20px', // Symmetrical padding for a balanced look
    border: 'none', // No border for a flat button design
    borderRadius: '5px', // Slightly rounded corners for the button
    fontSize: '10px', // Matching font size for consistency
    fontWeight: 'bold', // Bold text to make the button text stand out
    color: '#fff', // White text for contrast
    backgroundColor: '#007bff', // A pleasant shade of blue for the button background
    cursor: 'pointer', // Cursor change to indicate it's clickable
    margin: '20px 0 0px 10px', // Vertical margin for spacing, no horizontal margin
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
    transition: 'background-color 0.3s', // Smooth background color transition on hover
  };
  
  // On hover, we'll slightly darken the button's background color
  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#0056b3', // Darker shade of blue for the hover state
  };

  return (
    <div className="student-list-container">
      <h1 style={headingStyle}>Students List</h1>
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
        style={searchInputStyle}
      />

      <button
        onClick={downloadExcel}
        style={buttonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
      >
        Download Excel
      </button>

      <table className="student-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Student ID</th>
            <th>Password</th>
            <th>Institute ID</th>
            <th>Batch Start Date</th>
            <th>Batch End Date</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Mother's Name</th>     
            <th>Amount</th>
            <th>Batch Year</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.student_id}>
              <td>{renderImage(student.image)}</td>
              <td>{student.student_id}</td>
              <td>{student.password}</td>
              <td>{student.instituteId}</td>
              <td>{student.batchStartDate}</td>
              <td>{student.batchEndDate}</td>
              <td>{student.lastName}</td>
              <td>{student.firstName}</td>
              <td>{student.middleName}</td>
              <td>{student.motherName}</td>
          
              <td>{student.amount}</td>
              <td>{student.batch_year}</td>
              <td>{student.subject_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;