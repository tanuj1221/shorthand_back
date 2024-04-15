import React, { useState, useEffect } from 'react';
import axios from 'axios';


function StudentForm() {
    const [batchYears, setBatchYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [batchInfo, setBatchInfo] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [studentDetails, setStudentDetails] = useState({
        firstName: '',
        lastName: '',
        motherName: '',
        middleName: '',
        subjectsId: '',
        studentId: '',
        password: ''
    });

    // Fetch Batch Years
    useEffect(() => {
        const fetchBatchInfo = async () => {
            const result = await axios('http://localhost:3001/batch');
            setBatchYears(result.data.map(batch => batch.batch_year));
        };
        fetchBatchInfo();
    }, []);

    // Fetch Semesters for a given Batch Year
    useEffect(() => {
        const fetchSemesters = async () => {
            const result = await axios(`http://localhost:3001/batch?batch_year=${selectedYear}`);
            setSemesters(result.data);
        };
        if (selectedYear) fetchSemesters();
    }, [selectedYear]);

    // Fetch Subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            const result = await axios('http://localhost:3001/subjectsAndIds');
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Generate a random student ID and password
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
            subjectsId: studentDetails.subjectsId.map(Number)
        };

        try {
            await axios.post('http://localhost:3001/registerstudent', newStudent);
            alert('Student created successfully!');
        } catch (error) {
            alert('Failed to create student');
            console.error(error);
        }
    };
    const handleChange = (e) => {
        setStudentDetails({...studentDetails, [e.target.name]: e.target.value});
    };

    return (
        <div>
            <h1>Register New Student</h1>
            <form onSubmit={handleSubmit}>
            <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={studentDetails.lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={studentDetails.firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Middle Name:</label>
                    <input type="text" name="middleName" value={studentDetails.middleName} onChange={handleChange} required />
                </div>

                <div>
                    <label>Mother's Name:</label>
                    <input type="text" name="motherName" value={studentDetails.motherName} onChange={handleChange} required />
                </div>

                <div>
                    <label>Batch Year:</label>
                    <select value={selectedYear} onChange={handleYearChange}>
                        <option value="">Select Batch Year</option>
                        {batchYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
                <div>
                    <label>Semester:</label>
                    <select value={selectedSemester} onChange={handleSemesterChange}>
                        <option value="">Select Semester</option>
                        {semesters.map(semester => <option key={semester.sem} value={semester.sem}>{semester.sem}</option>)}
                    </select>
                </div>
                <div>
                <label>Subject:</label>
                    <select multiple onChange={(e) => setStudentDetails({...studentDetails, subjectsId: Array.from(e.target.selectedOptions, option => option.value)})}>
                        {subjects.map(subject => <option key={subject.subjectId} value={subject.subjectId}>{subject.subject_name}</option>)}
                    </select>
                </div>
                <button type="submit">Register Student</button>
            </form>
        </div>
    );
}

export default StudentForm;