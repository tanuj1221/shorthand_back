import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CropperModal from './CropperModal';

const EditStudentForm = () => {
  const { id: studentId } = useParams();
  const [studentDetails, setStudentDetails] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    motherName: '',
    mobile_no: '',
    email: '',
    batch_year: '',
    sem: '',
    image: ''
  });
  const [batchYears, setBatchYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [batchInfo, setBatchInfo] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [cropperModalOpen, setCropperModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  useEffect(() => {
    const fetchBatchInfo = async () => {
      const result = await axios('http://localhost:3000/batch');
      setBatchYears(result.data.map(batch => batch.batch_year));
    };
    fetchBatchInfo();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const fetchSemesters = async () => {
        try {
          const result = await axios(`http://localhost:3000/batch?batch_year=${selectedYear}`);
          setSemesters(result.data);
        } catch (error) {
          console.error('Error fetching semesters:', error);
        }
      };
      fetchSemesters();
    }
  }, [selectedYear]);
  
  useEffect(() => {
    if (semesters.length > 0 && studentDetails.sem) {
      setSelectedSemester(studentDetails.sem);
    }
  }, [semesters, studentDetails.sem]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateForm()) {
      alert('Please fill all required fields correctly.');
      return;
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
    if (file) {
      setSelectedFile(file);
      setCropperModalOpen(true);
    }
  };

  const handleCroppedImage = (blob) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageBytes = new Uint8Array(event.target.result);
      const imageText = btoa(String.fromCharCode.apply(null, imageBytes));
      setStudentDetails(prevDetails => ({ ...prevDetails, image: imageText }));
      setImagePreview(URL.createObjectURL(blob));
    };
    reader.readAsArrayBuffer(blob);
  };

  // Media query hooks
  const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 950);
  const [isVeryNarrowScreen, setIsVeryNarrowScreen] = useState(window.innerWidth < 768);
  const [isExtraNarrowScreen, setIsExtraNarrowScreen] = useState(window.innerWidth < 478);

  useEffect(() => {
    const updateMedia = () => {
      setIsNarrowScreen(window.innerWidth < 950);
      setIsVeryNarrowScreen(window.innerWidth < 768);
      setIsExtraNarrowScreen(window.innerWidth < 478);
    };
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  // Styles
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
    marginBottom: '20px',
  };
  
  const labelStyle = {
    marginBottom: '10px',
    fontSize: isVeryNarrowScreen ? '10px' : '16px',
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
    cursor: 'pointer',
    marginBottom: '10px',
  };
  
  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: isExtraNarrowScreen ? '6px' : isNarrowScreen ? '10px' : '14px',
    color: '#333',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  };
  
  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%234A4A4A" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 10l5 5 5-5z"/></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '12px',
  };
  
  const buttonStyle = {
    gridColumn: '1/-1',
    padding: isExtraNarrowScreen ? '7px 12px' : isNarrowScreen ? '10px 15px' : '15px 30px',
    fontSize: isExtraNarrowScreen ? '8px' : isNarrowScreen ? '10px' : '14px',
    backgroundColor: '#5C6BC0',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };
  
  const imagePreviewStyle = {
    marginTop: '10px',
    maxWidth: '40%',
    height: 'auto',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };
  
  const headingStyle = {
    textAlign: 'center',
    color: '#333',
    fontSize: isVeryNarrowScreen ? '1.2rem' : isNarrowScreen ? '1.7rem' : '2rem',
    fontWeight: '300',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1rem',
    paddingTop: '20px',
  };

  const capitalizedNameInputStyle = {
    ...inputStyle,
    textTransform: 'uppercase',
  };

  const stackGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    margin: '10px auto',
    padding: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    gridColumn: '1 / -1',
  };

  const fileInputContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
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

        <div style={stackGroupStyle}>
          <div style={fileInputContainerStyle}>
            <label style={labelStyle}>Upload Photo (20-50 KB size)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              style={fileInputStyle}
            />
            {imagePreview ? (
              <div style={{ textAlign: 'center' }}>
                <img src={imagePreview} alt="Preview" style={imagePreviewStyle} />
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10px'
                }}>
                  <button type="button" onClick={() => {
                    setImagePreview(null);
                    setStudentDetails(prevDetails => ({ ...prevDetails, image: '' }));
                  }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '16px',
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

      <CropperModal
        isOpen={cropperModalOpen}
        onClose={() => setCropperModalOpen(false)}
        src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
        onCrop={handleCroppedImage}
      />
    </div>
  );
};

export default EditStudentForm;