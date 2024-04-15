const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();
const PORT = 3000;

// importing mysql connection 
const connection = require('./config/db')


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to MySQL Server! +${err}`);


  connection.query('CREATE DATABASE IF NOT EXISTS demo', (err, result) => {
    if (err) throw err;
    console.log('Database checked/created successfully');
  });

  // Use the newly created database
  connection.query('USE demo', (err, result) => {
    if (err) throw err;
  });

  // Create the student table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS student (
      student_id INT AUTO_INCREMENT PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      instituteId INT NOT NULL,
      batchNo VARCHAR(50),
      batchStartDate DATE,
      batchEndDate DATE,
      subjectsId JSON, 
      amount BOOLEAN NOT NULL
    )`;

  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Table checked/created successfully');
  });

  connection.end();
});


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());


// Middleware to track last activity time and log inactivity
function trackActivityTime(req, res, next) {
    const now = Date.now();
    const lastActivity = req.session.lastActivity || now;

    if (req.session.userId && now - lastActivity > INACTIVITY_TIMEOUT) {
        console.log(`[${new Date().toISOString()}] Session inactive for user ${req.session.userId}`);
        // Optional: Destroy the session or take other actions.
    }

    req.session.lastActivity = now;
    next();
}

// To ensure that all routes are logged
function logEndpointAccess(req, res, next) {
  const accessTime = new Date().toISOString();
  console.log(`[${accessTime}] Endpoint hit: ${req.originalUrl} by user ${req.session.userId || 'Anonymous'}`);
  next();
}

app.use(trackActivityTime)
app.use(logEndpointAccess);

// Configure session middleware
app.use(session({
  secret: 'divis@GeYT', // replace with a real secret key
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 300000 } // 5 minutes
}));

const USER_ID = 'admin';
const PASSWORD = 'password'; // You should never hard-code passwords in real applications!

app.post('/login', (req, res) => {
  const { userId, password } = req.body;

  if (userId === USER_ID && password === PASSWORD) {
    req.session.userId = userId;
    res.send('Logged in successfully!');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
      const accessTime = new Date().toISOString();
      console.log(`[${accessTime}] Access granted to ${req.originalUrl} for user ${req.session.userId}`);
      next();
    } else {
      res.status(403).send('Not authenticated');
    }
  }

app.get('/practice', isAuthenticated, (req, res) => {
  res.send('Practice Page - Access Granted');
});

app.get('/MCQ', isAuthenticated, (req, res) => {
  res.send('MCQ Page - Access Granted');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send('Could not log out');
    } else {
      res.send('Logged out successfully');
    }
  });
});

app.get('/', (req, res) => {
    res.send("Hello, World")
})

app.get('/login', (req, res) => {
    // Check if the user is already authenticated
    if (req.session.userId) {
      res.send("Logged in Successfully");
    } else {
      res.send("Please log in.");
    }
});