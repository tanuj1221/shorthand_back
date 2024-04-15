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
      return <img src={imageUrl} alt="Student" className="student-image" />;
    }
    return null;
  };
  
  
  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(students.map(({ image, ...rest }) => rest));
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Students");
    XLSX.writeFile(workBook, "StudentData.xlsx");
  };


  return (
    <div className="student-list-container">
      <h1 className='heading' >Students List</h1>
      <input className='search-input'
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
      />

      <button className='button'
        onClick={downloadExcel}
      >
        Download Excel
      </button>

      <div className="table-responsive">
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


    </div>
  );
};

export default StudentList;