import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditStudentForm = () => {
  const { id: studentId } = useParams();
  const [studentDetails, setStudentDetails] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    motherName: '',
    mobile_no: '',
    email: '',
    batch_year: '',  // Add this line
    sem: '',
    image: ''
    // Add other fields as necessary
  });
  const [batchYears, setBatchYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [batchInfo, setBatchInfo] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (studentId) {
      axios.get(`http://localhost:3000/students/details/${studentId}`)
        .then(response => {
          const studentData = response.data;
          setStudentDetails(studentData);
          setSelectedYear(studentData.batch_year);
          if (studentData.image) {
            setImagePreview(`data:image/jpeg;base64,${studentData.image}`);
            setStudentDetails(prevDetails => ({ ...prevDetails, image: studentData.image }));
          }
        })
        .catch(error => {
          console.error('Failed to fetch student data:', error);
        });
    }
  }, [studentId]);
  

  // Fetch Batch Years
  useEffect(() => {
    // Fetch batch years independently as it doesn't depend on student details
    const fetchBatchInfo = async () => {
      const result = await axios('http://localhost:3000/batch');
      setBatchYears(result.data.map(batch => batch.batch_year));
    };
    fetchBatchInfo();
  }, []);

  // Fetch Semester
  useEffect(() => {
    // Fetch semesters based on the selected year
    if (selectedYear) {
      const fetchSemesters = async () => {
        try {
          const result = await axios(`http://localhost:3000/batch?batch_year=${selectedYear}`);
          setSemesters(result.data);
          // Set semester here might not be correct if studentDetails isn't ready yet
        } catch (error) {
          console.error('Error fetching semesters:', error);
        }
      };
      fetchSemesters();
    }
  }, [selectedYear]);
  
  useEffect(() => {
    // Set the semester once semesters are fetched and the student's semester is known
    if (semesters.length > 0 && studentDetails.sem) {
      setSelectedSemester(studentDetails.sem);
    }
  }, [semesters, studentDetails.sem]);  // React to changes in semesters and the specific semester detail

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate input fields
    if (!validateForm()) {
      alert('Please fill all required fields correctly.');
      return; // Stop the form submission if validation fails
    }

    if (!studentDetails.image) {
      alert('Please upload an image.');
      return;
    }
  
    const updatedStudentDetails = {
      ...studentDetails,
      batch_year: selectedYear,
      sem: selectedSemester
    };
  
    try {
      const response = await axios.put(`http://localhost:3000/students/${studentId}`, updatedStudentDetails);
      alert('Student updated successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Failed to update student:', error);
      alert('Failed to update student. Check console for details.');
    }
  };
  
  // Function to validate form fields
  const validateForm = () => {
    return (
      studentDetails.firstName.trim() !== '' &&
      studentDetails.lastName.trim() !== '' &&
      studentDetails.middleName.trim() !== '' &&
      studentDetails.motherName.trim() !== '' &&
      studentDetails.mobile_no.trim() !== '' &&
      studentDetails.email.trim() !== '' &&
      selectedYear.trim() !== '' &&
      selectedSemester.trim() !== ''
    );
  };
  

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 60 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageBytes = new Uint8Array(event.target.result);
        const imageText = btoa(String.fromCharCode.apply(null, imageBytes));
        setStudentDetails(prevDetails => ({ ...prevDetails, image: imageText }));
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please select an image under 60KB.');
    }
  };


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

  return (
    <div>
      <h1 style={headingStyle}>Edit Student Details</h1>
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
              <label style={labelStyle}>Upload Photo (20-50 KB size)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={fileInputStyle}
              />
              {imagePreview ? (
                <div>
                  <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />
                  <div style={{
                    display: 'flex', // Use flexbox to align items
                    justifyContent: 'center', // Center horizontally in the flex container
                    marginTop: '10px' // Add some space above this div
                  }}>
                    <button type="button" onClick={() => {
                      setImagePreview(null);
                      setStudentDetails(prevDetails => ({ ...prevDetails, image: '' }));
                    }}
                      style={{
                        padding: '10px 20px', // Padding inside the button for better touch area
                        backgroundColor: '#f44336', // A red color for the remove button, indicating a destructive action
                        color: 'white', // White text color for contrast
                        border: 'none', // No border
                        borderRadius: '4px', // Rounded corners
                        cursor: 'pointer', // Cursor indicates clickable area
                        fontSize: '16px', // Font size for readability
                      }}>
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <p>No image selected. Please upload an image.</p>
              )}
            </div>
          </div>

        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default EditStudentForm;