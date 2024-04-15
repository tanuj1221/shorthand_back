// controllers/authController.js
const connection = require('../config/db1');


exports.loginStudent = async (req, res) => {
  console.log("Trying student login");
  const { userId, password } = req.body;

  const query1 = 'SELECT * FROM student14 WHERE student_id = ?';

  try {
      const [results] = await connection.query(query1, [userId]);
      if (results.length > 0) {
          const student = results[0];

          if (student.password === password) {
              // Set student session
              req.session.studentId = student.student_id;
              res.send('Logged in successfully as a student!');
          } else {
              res.status(401).send('Invalid credentials for student');
          }
      } else {
          res.status(404).send('Student not found');
      }
  } catch (err) {
      res.status(500).send(err.message);
  }
};


exports.changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.session.studentId; // Assuming userId is stored in the session
  
    // Update password in the database
    const updateQuery = 'UPDATE student14 SET password = ? WHERE student_id = ?';
  
    await connection.query(updateQuery, [newPassword, userId], (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).send('Error updating password');
      } else {
        console.log('Password updated successfully');
        res.send('Password updated successfully');
      }
    });
  };







  // getting the student data 
  exports.getstudentData = async (req, res) => {
    try {
      const userId = req.session.studentId;
      const selectQuery = 'SELECT * FROM student14 WHERE student_id = ?';
      // Use promise-based query execution
      const [rows, fields] = await connection.query(selectQuery, [userId]);
      console.log([rows, fields])
      if (rows.length > 0) {
        const studentData = rows[0];
        res.json(studentData);
      } else {
        res.status(404).send('Student not found');
      }
    } catch (err) {
      console.log('Error fetching user data:', err);
      res.status(500).send(err);
    }
  };
  
// getting available subject data for student 
// [
//   {
//     "subjectsId": "[101,102]"
//   }
// ]

// this is for time 
exports.getStudentSubjects = async (req, res) => {
  try {
    const userId = req.session.studentId;
    const subjectQuery = "SELECT subjectsId FROM student14 WHERE student_id = ?";

    const subjects = await connection.query(subjectQuery, [userId]);
    console.log(subjects);

    // Check if the query returned any results
    if (subjects.length > 0 && subjects[0].length > 0) {
      // Parse the subjectsId assuming it is stored as a JSON string (e.g., "[101]")
      const rawSubjectsId = subjects[0][0].subjectsId;
      const parsedSubjectsId = JSON.parse(rawSubjectsId);  // Now should be an array, e.g., [101]

      // Fetch details from subjectsdb table
      const subjectsDetailsQuery = 'SELECT * FROM subjectsdb WHERE subjectId IN (?)';
      const subjectDetails = await connection.query(subjectsDetailsQuery, [parsedSubjectsId]);

      if (subjectDetails.length > 0) {
        res.json(subjectDetails[0]);
      } else {
        res.status(404).send('Subjects not found');
      }
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}



exports.updateTimer = async (req, res) => {
  try {
    const { timerValue } = req.body; // Directly using timerValue from the request body
    const studentId = req.session.studentId; // Assuming studentId is stored in session
    console.log(req.body); // Logging the body to see what's received

    // Ensure timerValue is a string representing a non-negative integer
    if (!/^\d+$/.test(timerValue)) {
      return res.status(400).send('Invalid timer value');
    }

    const updateQuery = 'UPDATE student14 SET rem_time = ? WHERE student_id = ?';
    const [result] = await connection.query(updateQuery, [timerValue, studentId]);

    if (result.affectedRows > 0) {
      res.send('Timer updated successfully');
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    console.error('Error updating timer:', err);
    res.status(500).send(err.message);
  }
};

exports.getStudentSubjectInfo = async (req, res) => {
  try {
    const userId = req.session.studentId;  // Get student ID from the session, assumed to be stored as a string

    const studentSubjectsQuery = `
      SELECT s.student_id, s.image, CONCAT(s.firstName, ' ', s.lastName) AS studename, sub.subject_name, sub.subjectId
      FROM student14 AS s
      JOIN JSON_TABLE(
        s.subjectsId,
        '$[*]' COLUMNS(subjectId CHAR(50) COLLATE utf8mb4_unicode_ci PATH '$')  -- Specifying collation here
      ) AS subjects ON s.student_id = ?
      JOIN subjectsdb AS sub ON subjects.subjectId COLLATE utf8mb4_unicode_ci = sub.subjectId COLLATE utf8mb4_unicode_ci  -- Matching collations for safe comparison
    `;

    const studentSubjects = await connection.query(studentSubjectsQuery, [userId]);

    if (studentSubjects.length > 0) {
      res.json(studentSubjects[0]);
    } else {
      res.status(404).send('No subjects found for this student');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
};
