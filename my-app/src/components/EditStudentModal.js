import React, { useState, useEffect } from 'react';
import axios from 'axios';


const EditStudentModal = ({ isOpen, onClose, student, onSubmit }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        firstName: '',
        lastName: '',
        middleName: '',
        motherName: '',
        batchStartDate: '',
        batchEndDate: '',
        batchYear: '',
        subjectName: '',
        instituteId: '',
        amount: ''
    });

    // Set form data when student data is available
    useEffect(() => {
        if (student) {
            setFormData({
                studentId: student.student_id || '',
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                middleName: student.middleName || '',
                motherName: student.motherName || '',
                batchStartDate: student.batchStartDate || '',
                batchEndDate: student.batchEndDate || '',
                batchYear: student.batch_year || '',
                subjectName: student.subject_name || '',
                instituteId: student.instituteId || '',
                amount: student.amount || ''
            });
        }
    }, [student]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure this URL matches your Express route for updating a student
        const updateUrl = `http://localhost:3000/students/edit/${student.student_id}`;
        try {
            const response = await axios.put(updateUrl, formData);
            alert('Student updated successfully!');
            onSubmit(); // This should trigger a refresh of the student list in the parent component
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to update student:', error);
            alert('Failed to update student. Please try again.');
        }
    };
    

    if (!isOpen) return null;

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <h2>Edit Student</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </label>
                    <label>
                        Middle Name:
                        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
                    </label>
                    <label>
                        Mother's Name:
                        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} />
                    </label>
                    <label>
                        Batch Year:
                        <input type="number" name="batchYear" value={formData.batchYear} onChange={handleChange} required />
                    </label>
                    <label>
                        Subject:
                        <input type="text" name="subjectName" value={formData.subjectName} onChange={handleChange} required />
                    </label>
                    <button type="submit">Update</button>
                    <button onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1000',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const modalContentStyle = {
    position: 'relative',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '50%',
    maxHeight: '80vh',
    overflowY: 'auto'
};

export default EditStudentModal;
