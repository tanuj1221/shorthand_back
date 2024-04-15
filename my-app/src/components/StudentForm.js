import React, { useState, useEffect } from 'react';
import axios from 'axios';


function StudentForm() {
  const [batchYears, setBatchYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [batchInfo, setBatchInfo] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [studentDetails, setStudentDetails] = useState({
    firstName: '',
    lastName: '',
    motherName: '',
    middleName: '',
    studentId: '',
    password: '',
    image: '',
    mobile_no: '',
    email: '',
  });
  // Fetch Batch Years
  useEffect(() => {
    const fetchBatchInfo = async () => {
      const result = await axios('http://3.110.77.175:3000/batch');
      setBatchYears(result.data.map(batch => batch.batch_year));
    };
    fetchBatchInfo();
  }, []);

  // Fetch Semesters for a given Batch Year
  useEffect(() => {
    const fetchSemesters = async () => {
      const result = await axios(`http://3.110.77.175:3000/batch?batch_year=${selectedYear}`);
      setSemesters(result.data);
    };
    if (selectedYear) fetchSemesters();
  }, [selectedYear]);

  // Fetch Subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const result = await axios('http://3.110.77.175:3000/subjectsAndIds');
      setSubjects(result.data);
    };
    fetchSubjects();
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    const selectedBatch = semesters.find(sem => sem.sem === event.target.value);
    if (selectedBatch) {
      setBatchInfo(selectedBatch);
    }
  };
  const handleSubjectChange = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (const subjectId of selectedSubjects) {
      const randomId = Math.floor(10000 + Math.random() * 90000).toString();
      const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();

      const newStudent = {
        ...studentDetails,
        studentId: randomId,
        password: randomPassword,
        courseId: '[11]',
        amount: 'pending',
        loggedIn: 'yes',
        remTime: '10',
        done: 'no',
        ...batchInfo,
        subjectsId: [Number(subjectId)],
      };

      try {
        await axios.post('http://3.110.77.175:3000/registerstudent', newStudent);
        console.log(`Student created successfully for subject ${subjectId}!`);
      } catch (error) {
        console.error(`Failed to create student for subject ${subjectId}:`, error);
      }
    }

    alert('Students created successfully!');

    // Clear form fields after submission
    setSelectedYear('');
    setSelectedSemester('');
    setSelectedSubjects([]);
    setImagePreview(null);
    setStudentDetails({
      firstName: '',
      lastName: '',
      motherName: '',
      middleName: '',
      studentId: '',
      password: '',
      image: '',
      mobile_no: '',
      email: '',
    });
  };




  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 60 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageBytes = new Uint8Array(event.target.result);
        const imageText = btoa(String.fromCharCode.apply(null, imageBytes));
        setStudentDetails({ ...studentDetails, image: imageText });
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please select an image under 60KB.');
    }
  };


  const handleChange = (e) => {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  };


  const formStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    alignItems: 'center',
    maxWidth: '800px', // Restricting form width for better aesthetics on larger screens
    margin: '0 auto', // Center aligning the form
    padding: '40px', // Adding some padding around the form
    backgroundColor: '#f7f7f7', // A light background color for the form
    borderRadius: '10px', // Rounded corners for the form
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // A subtle shadow to lift the form off the page
  };
  
  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px', // Adds space between each form group
  };
  
  const labelStyle = {
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#4A4A4A',
  };

  const fileInputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer', // Change cursor on hover to indicate it's clickable
    marginBottom: '10px', // If there's an image preview, add some space below the input
  };
  
  const inputStyle = {
    padding: '10px', // Comfortable padding inside the inputs
    borderRadius: '4px', // Rounded corners for a modern look
    border: '1px solid #ddd', // Subtle border color
    fontSize: '14px', // Standard font size for inputs
    color: '#333', // Dark color for input text for readability
    backgroundColor: '#fff', // White background for the inputs
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)', // Subtle inner shadow for depth
  };
  
  const selectStyle = {
    ...inputStyle, // Inherits the styles from inputStyle to maintain consistency
    appearance: 'none', // Removes the default system appearance
    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%234A4A4A" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 10l5 5 5-5z"/></svg>')`, // Adds a custom dropdown arrow
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center', // Position for the dropdown arrow
    backgroundSize: '12px', // Size of the dropdown arrow
  };
  
  const checkboxContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };
  
  const buttonStyle = {
    gridColumn: 'span 2',
    padding: '15px 30px',
    fontSize: '16px',
    backgroundColor: '#5C6BC0', // A more modern button color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s', // Transition for when the button is hovered or focused
    ':hover': {
      backgroundColor: '#3F51B5', // Darken the button color on hover for feedback
    },
    ':focus': {
      outline: 'none', // Remove default focus outline
      boxShadow: '0 0 0 2px #C5CAE9', // Custom focus style
    },
  };
  
  const imagePreviewStyle = {
    marginTop: '10px', // Add space between the input and the preview
    maxWidth: '100%', // Ensure it's not larger than the container
    height: 'auto', // Maintain aspect ratio
    borderRadius: '4px', // Slightly rounded corners for the preview image
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for some depth
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
  return (
    <div>
    <h1 style={headingStyle}>Register New Student</h1>
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Last Name:</label>
        <input type="text" name="lastName" value={studentDetails.lastName} onChange={handleChange} required style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>First Name:</label>
        <input type="text" name="firstName" value={studentDetails.firstName} onChange={handleChange} required style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Middle Name:</label>
        <input type="text" name="middleName" value={studentDetails.middleName} onChange={handleChange} required style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Mother's Name:</label>
        <input type="text" name="motherName" value={studentDetails.motherName} onChange={handleChange} required style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Batch Year:</label>
        <select value={selectedYear} onChange={handleYearChange} style={selectStyle}>
          <option value="">Select Batch Year</option>
          {batchYears.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Semester:</label>
        <select value={selectedSemester} onChange={handleSemesterChange} style={selectStyle}>
          <option value="">Select Semester</option>
          {semesters.map(semester => <option key={semester.sem} value={semester.sem}>{semester.sem}</option>)}
        </select>
      </div>


      <div style={formGroupStyle}>
          <label style={labelStyle}>Mobile No:</label>
          <input
            type="tel"
            name="mobile_no"
            value={studentDetails.mobile_no}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Please enter a 10-digit mobile number"
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Email:</label>
          <input
            type="email"
            name="email"
            value={studentDetails.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

      <div style={{ ...formGroupStyle, ...checkboxContainerStyle }}>
        <label style={labelStyle}>Subjects:</label>
        {subjects.map((subject) => (
          <div key={subject.subjectId}>
            <input
              type="checkbox"
              value={subject.subjectId}
              checked={selectedSubjects.includes(subject.subjectId)}
              onChange={() => handleSubjectChange(subject.subjectId)}
              
            />
            <label>{subject.subject_name}</label>
          </div>
        ))}
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Photo(size 22kb to 50kb):</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          style={fileInputStyle}
          required
        />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />
          </div>
        )}
      </div>

      <button type="submit" style={buttonStyle}>Submit</button>
   </form>
  </div>
  );
}

export default StudentForm;