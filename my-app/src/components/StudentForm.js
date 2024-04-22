import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function StudentForm() {
  // State hooks for various component states
  const [batchYears, setBatchYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [batchInfo, setBatchInfo] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const { studentId } = useParams();
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
      const result = await axios('http://localhost:3000/batch');
      setBatchYears(result.data.map(batch => batch.batch_year));
    };
    fetchBatchInfo();
  }, []);
  
  useEffect(() => {
    if (studentId) { // Only fetch if studentId is available
      const fetchStudentData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/students/${studentId}`);
          const studentData = response.data;
          setStudentDetails({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            motherName: studentData.motherName,
            middleName: studentData.middleName,
            studentId: studentData.studentId,
            password: studentData.password,
            image: studentData.image,
            mobile_no: studentData.mobile_no,
            email: studentData.email,
          });
          setSelectedYear(studentData.batchYear);
          setSelectedSemester(studentData.semester);
          setSelectedSubjects(studentData.subjects.map(subject => subject.subjectId));
          // Add other fields as necessary
        } catch (error) {
          console.error('Failed to fetch student data:', error);
        }
      };

      fetchStudentData();
    }
  }, [studentId]); // Retrieve student ID from URL

  // Applying media queries===========
    // For 950px
  const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 950);

  const updateMedia = () => {
    setIsNarrowScreen(window.innerWidth < 950);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  // For 768px
  const [isVeryNarrowScreen, setIsVeryNarrowScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const updateMedia = () => {
      setIsVeryNarrowScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  // For screens below 478px
  const [isExtraNarrowScreen, setIsExtraNarrowScreen] = useState(window.innerWidth < 478);

  useEffect(() => {
    const handleResize = () => {
      setIsExtraNarrowScreen(window.innerWidth < 478);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  //End Applying media queries===========


  // Fetch Semesters for a given Batch Year
  useEffect(() => {
    const fetchSemesters = async () => {
      const result = await axios(`http://localhost:3000/batch?batch_year=${selectedYear}`);
      setSemesters(result.data);
    };
    if (selectedYear) fetchSemesters();
  }, [selectedYear]);

  // Fetch Subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const result = await axios('http://localhost:3000/subjectsAndIds');
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
        await axios.post('http://localhost:3000/registerstudent', newStudent);
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
  gridTemplateColumns: isExtraNarrowScreen ? 'repeat(2, 1fr)' : isNarrowScreen ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
  gap: '10px',
  alignItems: 'center',
  maxWidth: '1500px',
  margin: '0 auto',
  padding: isExtraNarrowScreen ? '10px' : isNarrowScreen ? '20px' : '40px',
  backgroundColor: '#f7f7f7',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

  
  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px', // Adds space between each form group
  };
  
  const labelStyle = {
    marginBottom: '10px',
    fontSize: isVeryNarrowScreen ? '10px' : '16px', // Smaller font size for very narrow screens
    fontWeight: 'bold',
    color: '#4A4A4A',
  };

  const fileInputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: isExtraNarrowScreen ? '8px' : isNarrowScreen ? '10px' : '14px',
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
    fontSize: isExtraNarrowScreen ? '6px' : isNarrowScreen ? '10px' : '14px',
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
    alignItems: 'center'
  };
  
  const buttonStyle = {
    gridColumn: '1/-1', // Adjust grid column span
    padding: isExtraNarrowScreen ? '7px 12px' : isNarrowScreen ? '10px 15px' : '15px 30px',
    fontSize: isExtraNarrowScreen ? '8px' : isNarrowScreen ? '10px' : '14px',
    backgroundColor: '#5C6BC0',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#3F51B5',
    },
    ':focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px #C5CAE9',
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
    fontSize: isVeryNarrowScreen ? '1.2rem' : isNarrowScreen ? '1.7rem' : '2rem',// A larger font size for the main heading
    fontWeight: '300', // A lighter font weight for a modern look
    textTransform: 'uppercase', // Uppercase text for stylistic preference
    letterSpacing: '1px', // Spacing out letters a bit for readability
    marginBottom: '1rem', // Adding some space below the heading
    paddingTop: '20px', // Padding at the top to push the content down a bit
  };

  const capitalizedNameInputStyle = {
    ...inputStyle,
    textTransform: 'uppercase',
  };

  const stackGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Ensures content inside is also centered
    width: '100%', // Use 100% width of the form container
    maxWidth: '1200px', // Adjust width as needed to fit the design
    margin: '20px auto', // Auto margins for horizontal centering
    padding: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    gridColumn: '1 / -1', // Span across all columns in the grid
  };
  

  const subjectGridStyle = {
    display: 'grid',
    gridTemplateColumns: isVeryNarrowScreen ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', // Adjust column count for narrower screens
    gap: '20px',
    padding: '10px',
    alignItems: 'center',
    justifyContent: 'start',
  };
  
  const subjectStyle = {
    fontSize: isVeryNarrowScreen ? '10px' : '16px'// Smaller font size for very narrow screens
  }


  return (
    <div>
      <h1 style={headingStyle}>Register New Student</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Last Name:</label>
          <input type="text" name="lastName" value={studentDetails.lastName} onChange={handleChange} required style={capitalizedNameInputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>First Name:</label>
          <input type="text" name="firstName" value={studentDetails.firstName} onChange={handleChange} required style={capitalizedNameInputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Middle Name:</label>
          <input type="text" name="middleName" value={studentDetails.middleName} onChange={handleChange} required style={capitalizedNameInputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Mother's Name:</label>
          <input type="text" name="motherName" value={studentDetails.motherName} onChange={handleChange} required style={capitalizedNameInputStyle} />
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

          <div style={stackGroupStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Subjects:</label>
              {/* Apply the new grid style to the container that holds subject checkboxes */}
              <div style={subjectGridStyle}>
                {subjects.map((subject) => (
                  <div key={subject.subjectId} style={checkboxContainerStyle}>
                    <input
                      type="checkbox"
                      value={subject.subjectId}
                      checked={selectedSubjects.includes(subject.subjectId)}
                      onChange={() => handleSubjectChange(subject.subjectId)}
                    />
                    <label style={subjectStyle}>{subject.subject_name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div style={formGroupStyle}>
            <label style={labelStyle}>Upload Photo(20-50 kb size)</label>
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
          </div>

        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
}

export default StudentForm;