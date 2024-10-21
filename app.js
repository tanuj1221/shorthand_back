const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS module
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/studentRoutes');
const datainput = require('./routes/inputDataRoutes');
const subjectRoutes = require('./routes/subjectsroutes');
const instituteRoutes = require('./routes/instituteRoutes')
const adminView = require('./routes/adminViewRoutes')
const mockroute = require('./routes/mockRoutes')
const crypto = require('crypto');
const connection = require('./config/db1');
const auth1 = require('./routes/isauthsti')
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:3001', 'http://shorthandexam.in', '*'],
  credentials: true
}));

// Other app setup (body parser, session, etc.)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'divis@GeYT',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_live_d4DgqU3P4V8cqL',
  key_secret: 'CdzEa5TlmdsPYD5arKVsrFkt'
});


app.post('/createOrder', async (req, res) => {
  try {
    const payment_capture = true;
    const amount = req.body.amount;
    const currency = 'INR';

    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise
      currency,
      receipt: 'rcptid_' + new Date().getTime(),
      payment_capture
    };

    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount
    });
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});


// Endpoint to verify the payment
app.post('/verifyPayment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentIds // Expect an array of studentIds from the frontend
    } = req.body;

    // Create a hash using the order ID, payment ID, and Razorpay key secret
    const shasum = crypto.createHmac('sha256', razorpay.key_secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    // Check if the created hash matches the razorpay_signature
    if (digest !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature. Payment not verified.' });
    }

    // If the payment is verified, update the payment status for all selected students
    const updateQuery = "UPDATE student14 SET amount = 'paid' WHERE student_id IN (?)";
    await connection.query(updateQuery, [studentIds]);

    res.json({ success: true, message: 'Payment verified and student records updated.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/verifyPayment1', async (req, res) => {
  try {
    const {
      userInfo,  // User information received
      students,
      amount,
  // Array of student IDs
      utr        // UTR number for the transaction
    } = req.body;

    // Update the payment status for all selected students to 'waiting'
    const updateQuery = "UPDATE student14 SET amount = 'waiting' WHERE student_id IN (?)";
    await connection.query(updateQuery, [students]);


    // Save details to the qr_pay table
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
    const istDate = new Date(now.getTime() + istOffset);
    const currentDate = istDate.toISOString().slice(0, 19).replace('T', ' ');
    const insertQuery = `INSERT INTO qrpay (student_id, user, mobile, email, utr, date,amount) VALUES ?`;
    const values = students.map(studentId => [
        studentId,
        userInfo.name,
        userInfo.contact,
        userInfo.email,
        utr,
        currentDate,
        amount
    ]);
    await connection.query(insertQuery, [values]);
    console.log('done')

    res.json({ success: true, message: 'Payment recorded and student records updated.' });
  } catch (error) {
    console.error('Payment recording failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Enable CORS with default options (accept requests from any origin)




// Other app setup (body parser, session, etc.)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'my-app/build')));
// Use the routes
app.use(authRoutes);
app.use(studentRoutes);
app.use(datainput);
app.use(subjectRoutes);
app.use(instituteRoutes)
app.use(adminView)
app.use(mockroute)
app.use(auth1)

// Add this catch-all route at the end of all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-app/build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://shorthandexam.in`);
});
