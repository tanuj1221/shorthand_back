import '../paymentmodal.css'; // Assuming your CSS file is named PaymentModal.css and is in the same directory

const PaymentModal = ({ isOpen, onClose, onSubmit, userInfo, setUserInfo }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    return (
        <div className="modal">
            <h2>Enter Payment Details</h2>
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
            <button className="button" onClick={() => onSubmit(userInfo)}>Proceed to Pay</button>
            <button className="button cancel" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default PaymentModal;
