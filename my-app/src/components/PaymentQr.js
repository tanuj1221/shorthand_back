import '../paymentmodal.css'; // Assuming your CSS file is named PaymentModal.css and is in the same directory
import qr from '../images/qr.jpg';
import React, { useState } from 'react';

const PaymentQr = ({ isOpen, onClose, onSubmit, userInfo, setUserInfo, totalAmount }) => {
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate UTR to ensure it's numeric and at least 11 digits long
        if (name === 'utr' && (!/^\d{11,}$/.test(value))) {
            setError('Please enter a valid UTR/UPI transaction ID (at least 11 digits).');
        } else {
            setError(''); // Clear error if the current input is valid
            setUserInfo({ ...userInfo, [name]: value });
        }
    };

    const handleSubmit = () => {
        if (!userInfo.name || !userInfo.email || !userInfo.contact || !userInfo.utr) {
            setError('All fields are required.');
            return;
        }
        if (!/^\d{11,}$/.test(userInfo.utr)) {
            setError('Please enter a valid UTR/UPI transaction ID (at least 11 digits).');
            return;
        }
        setError('');
        onSubmit(userInfo);
    };

    return (
      <div className="modal">
        <h2>Enter Payment Details</h2>
        <div className="payment-amount">
          <p>Total Amount to Pay: ₹{totalAmount}</p>
        </div>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="input"
        />
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="input"
        />
        <input
          type="text"
          name="contact"
          value={userInfo.contact}
          onChange={handleChange}
          placeholder="Your Contact Number"
          className="input"
        />
        <div className="qr-code-section">
          <img src={qr} alt="UPI QR Code" className="qr-code" />
        </div>
        <input
          type="text"
          name="utr"
          value={userInfo.utr}
          onChange={handleChange}
          placeholder="Enter UTR/UPI transaction Id Number"
          className="input"
        />
        {error && <p className="error-message">{error}</p>}
        <button className="button" onClick={handleSubmit}>Payment Done</button>
        <button className="button cancel" onClick={onClose}>Cancel</button>
      </div>
    );
};

export default PaymentQr;