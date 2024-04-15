import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../tabel.css';
import PaymentModal from './PaymentModal'
const PayStudentList = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [showModal, setShowModal] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        contact: ''
    });







    // Function to fetch students from the backend
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/paystudents');
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchStudents();
    }, []);



    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(studentId)) {
                newSelected.delete(studentId);
            } else {
                newSelected.add(studentId);
            }
            return newSelected;
        });
    };

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };
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
    const handlePaymentInitiation = () => {
        setShowModal(true);
    };

    const handlePayment = async (userInfo) => {
        setShowModal(false); // Close the modal
        const amount = selectedStudents.size * 5; // Calculate total amount
        let order; // To store order details

        try {
            const orderResponse = await axios.post('http://localhost:3000/createOrder', { amount });
            order = orderResponse.data; // Store order data

            if (!window.Razorpay) {
                const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
                if (!res) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    return;
                }
            }

            const options = {
                key: 'rzp_live_d4DgqU3P4V8cqL',
                amount: order.amount.toString(),
                currency: order.currency,
                name: 'MSCE shorthand pune',
                description: 'Test Transaction',
                image: '',
                order_id: order.id,
                handler: async (response) => {
                    const studentIds = Array.from(selectedStudents);
                    const verificationResponse = await axios.post('http://localhost:3000/verifyPayment', {
                        razorpay_order_id: order.id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        studentIds
                    });

                    if (verificationResponse.data.success) {
                        fetchStudents();
                        alert('Payment successful!');
                    } else {
                        alert('Payment verification failed. Please try again.');
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: userInfo.contact
                },
                notes: {
                    address: 'Razorpay Corporate Office'
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const paymentWindow = new window.Razorpay(options);
            paymentWindow.open();
        } catch (error) {
            console.error('Failed to create order or initiate payment:', error);
            alert('Failed to initiate payment. Please try again.');
        }
    };



    const handleDeleteStudent = async (studentId) => {
        // Confirm before deletion
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await axios.delete(`http://localhost:3000/studentsdel/${studentId}`);
                fetchStudents(); // Refresh the student list after deletion
                alert('Student deleted successfully');
            } catch (error) {
                console.error('Failed to delete student:', error);
                alert('Failed to delete student. Please try again.');
            }
        } else {
            alert('Deletion cancelled');
        }
    };
    

    const buttonStyle = {
        padding: '12px 24px', // Generous padding for a larger click area
        border: 'none', // No border for a clean, flat design
        borderRadius: '6px', // Modern rounded corners
        fontSize: '16px', // Readable font size
        fontWeight: '600', // Semi-bold font weight
        color: '#ffffff', // White text for high contrast
        backgroundColor: '#4CAF50', // A green color indicating a positive action
        cursor: 'pointer', // Change cursor to indicate button is clickable
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)', // Subtle shadow for depth
        transition: 'background-color 0.2s, box-shadow 0.2s', // Smooth transition for hover effects
        margin: '20px'
    };

    const buttonDisabledStyle = {
        ...buttonStyle,
        backgroundColor: '#9E9E9E', // A grey color indicating the button is disabled
        cursor: 'default', // Default cursor to indicate the button is not clickable
        boxShadow: 'none', // No shadow for a "flatter" disabled look
        margin: '20px'
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

    const deleteButtonStyle = {
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#dc3545', // Bootstrap's red color for danger actions
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        outline: 'none',
        transition: 'opacity 0.3s ease',
    };
    const warningStyle  = {
        color:'red'
    }


    const deleteButtonHoverStyle = {
        opacity: '0.8',
    };

    return (
        <div className="student-list-container">
            <h1 style={headingStyle}>Payment</h1>
            <p className='warning' style={warningStyle}>Delete facility is available only before payment.
 </p>
<p lassName='warning' style={warningStyle}> No edit / delete allowed once fees is Paid.</p>
<p lassName='warning' style={warningStyle}> डिलिट सुविधा फक्त फी भरण्यापूर्वी उपलब्ध आहे..</p>
<p lassName='warning' style={warningStyle}> एकदा फी भरल्यानंतर एडिट / डिलिट करता येणार नाही.</p>

            <table className="student-table">
                <thead>
                    <tr>
                        <th></th> {/* Empty header for the checkbox column */}
                        <th>Delete</th>
                        <th>Image</th>
                        <th>ID</th>
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
                    {students.map(student => (
                        <tr key={student.student_id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.has(student.student_id)}
                                    onChange={() => handleSelectStudent(student.student_id)}
                                />
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDeleteStudent(student.student_id)}
                                    style={deleteButtonStyle}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = deleteButtonHoverStyle.opacity}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    Delete
                                </button>
                            </td>
                            <td>{renderImage(student.image)}</td>
                            <td>{student.student_id}</td>
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
            <div>{Array.from(selectedStudents).join(', ')}</div>
            <div className="payment-info">
                <button
                    onClick={handlePaymentInitiation}
                    disabled={selectedStudents.size === 0}
                    style={selectedStudents.size === 0 ? buttonDisabledStyle : buttonStyle}
                >
                    Pay ₹{selectedStudents.size * 5}
                </button>
                <PaymentModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handlePayment}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                />

            </div>
        </div>
    );
};

export default PayStudentList
