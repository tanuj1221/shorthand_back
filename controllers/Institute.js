const connection = require('../config/db1');


exports.loginInstitute = async (req, res) => {
  console.log("Trying institute login");
  const { userId, password } = req.body;

  const query1 = 'SELECT * FROM institutedb WHERE instituteId = ?';

  try {
      const [results] = await connection.query(query1, [userId]);
      if (results.length > 0) {
          const institute = results[0];
          console.log(institute);

          if (institute.password === password) {
              // Set institute session
              req.session.instituteId = institute.instituteId;
              res.send('Logged in successfully as an institute!');
          } else {
              res.status(401).send('Invalid credentials for institute');
          }
      } else {
          res.status(404).send('Institute not found');
      }
  } catch (err) {
      res.status(500).send(err.message);
  }
};



exports.getStudentsByInstitute = async (req, res) => {
  if (!req.session || !req.session.instituteId) {
      return res.status(403).send('Not authenticated as an institute');
  }
  const instituteId = req.session.instituteId;
  const studentQuery = "SELECT * FROM student14 WHERE instituteId = ?";

  try {
      const [students] = await connection.query(studentQuery, [instituteId]);
      if (students.length > 0) {
          res.json(students);
      } else {
          res.status(404).send('No students found for this institute');
      }
  } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Failed to retrieve data");
  }
};
exports.registerStudent = async (req, res) => {
    const instituteId = req.session.instituteId;
    const {
      studentId,
      firstName,
      lastName,
      motherName,
      middleName,
      subjectsId,
      password,
      courseId,
      batch_year,
      sem,
      batchStartDate,
      batchEndDate,
      amount,
      loggedIn,
      remTime,
      done,
      image,
      mobile_no,
      email,
    } = req.body;
  
    const insertQuery =
      "INSERT INTO student14 (student_id, password, instituteId, firstName, lastName, motherName, middleName, subjectsId, courseId, batch_year, sem, batchStartDate, batchEndDate, amount, loggedIn, rem_time, done, image, mobile_no, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
    try {
      await connection.query(insertQuery, [
        studentId,
        password,
        instituteId,
        firstName,
        lastName,
        motherName,
        middleName,
        JSON.stringify(subjectsId),
        courseId,
        batch_year,
        sem,
        batchStartDate,
        batchEndDate,
        amount,
        loggedIn,
        remTime,
        done,
        image,
        mobile_no,
        email,
      ]);
      res.send('Student registered successfully');
    } catch (err) {
      console.error('Error inserting student:', err);
      res.status(500).send('Error registering student');
    }
  };

// exports.registerStudent = async (req, res) => {
//     const instituteId = req.session.instituteId;
//     const {
//         studentId, firstName, lastName, motherName, middleName, subjectsId, password, courseId,
//         batch_year, sem, batchStartDate, batchEndDate, amount, loggedIn, remTime, done
//     } = req.body;
  
//     // Ensure all placeholders are accounted for in the SQL query
//     const insertQuery = "INSERT INTO student14 (student_id, password, instituteId, firstName, lastName, motherName, middleName, subjectsId, courseId, batch_year, sem, batchStartDate, batchEndDate, amount, loggedIn, rem_time, done) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
//     try {
//         await connection.query(insertQuery, [
//             studentId, password, instituteId, firstName, lastName, motherName, middleName, JSON.stringify(subjectsId),
//             courseId, batch_year, sem, batchStartDate, batchEndDate, amount, loggedIn, remTime, done
//         ]);
//         res.send('Student registered successfully');
//     } catch (err) {
//         console.error('Error inserting student:', err);
//         res.status(500).send('Error registering student');
//     }
//   };


exports.getstudentslist = async (req, res) => {
  try {
     const instituteId = req.session.instituteId;
      // Fetch all students
      const studentQuery = "SELECT student_id, password, instituteId, batchStartDate, batchEndDate, firstName, lastName, motherName, middleName, amount, batch_year, subjectsId, image FROM student14 WHERE instituteId = ?";
      const [students] = await connection.query(studentQuery, [instituteId]);

      // Fetch all subjects
      const subjectQuery = "SELECT subjectId, subject_name FROM subjectsDb";
      const [subjects] = await connection.query(subjectQuery);

      // Create a map for quick lookup of subject names by subjectId
      const subjectMap = subjects.reduce((map, subject) => {
          map[subject.subjectId] = subject.subject_name;
          return map;
      }, {});

      // Transform students data to include subject names and exclude subjectsId
      const enrichedStudents = students.map(student => {
          const subjectNames = student.subjectsId
              .replace(/[\[\]']+/g, '')  // Remove brackets and single quotes if they are part of the string
              .split(',')
              .map(id => id.trim())
              .map(id => subjectMap[id] || "Unknown Subject")  // Map each id to its subject name, defaulting to "Unknown Subject" if not found
              .join(', ');

          return {
              student_id: student.student_id,
              password: student.password,
              instituteId: student.instituteId,
              batchStartDate: student.batchStartDate,
              batchEndDate: student.batchEndDate,
              firstName: student.firstName,
              lastName: student.lastName,
              motherName: student.motherName,
              middleName: student.middleName,
              amount: student.amount,
              batch_year: student.batch_year,
              image : student.image,
              subject_name: subjectNames  // Use the resolved subject names
          };
      });

      if (enrichedStudents.length > 0) {
          res.json(enrichedStudents);
      } else { 
          res.status(404).send("No students found in the database.");
      }
  } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Failed to retrieve data");
  }
}

exports.getPendingAmountStudentsList = async (req, res) => {
  try {
      // Fetch students with amount pending
      const instituteId = req.session.instituteId;
      const pendingAmountStudentQuery = "SELECT student_id, password, instituteId, batchStartDate, batchEndDate, firstName, lastName, motherName, middleName, amount, batch_year, subjectsId, image FROM student14 WHERE amount = 'pending' AND instituteId = ?";
      const [pendingAmountStudents] = await connection.query(pendingAmountStudentQuery, [instituteId]);
  

      // Fetch all subjects
      const subjectQuery = "SELECT subjectId, subject_name FROM subjectsDb";
      const [subjects] = await connection.query(subjectQuery);

      // Create a map for quick lookup of subject names by subjectId
      const subjectMap = subjects.reduce((map, subject) => {
          map[subject.subjectId] = subject.subject_name;
          return map;
      }, {});

      // Transform students data to include subject names and exclude subjectsId
      const enrichedPendingAmountStudents = pendingAmountStudents.map(student => {
          const subjectNames = student.subjectsId
              .replace(/[\[\]']+/g, '')  // Remove brackets and single quotes if they are part of the string
              .split(',')
              .map(id => id.trim())
              .map(id => subjectMap[id] || "Unknown Subject")  // Map each id to its subject name, defaulting to "Unknown Subject" if not found
              .join(', ');

          return {
              student_id: student.student_id,
              password: student.password,
              instituteId: student.instituteId,
              batchStartDate: student.batchStartDate,
              batchEndDate: student.batchEndDate,
              firstName: student.firstName,
              lastName: student.lastName,
              motherName: student.motherName,
              middleName: student.middleName,
              amount: student.amount,
              batch_year: student.batch_year,
              image : student.image,
              subject_name: subjectNames  // Use the resolved subject names
          };
      });

      if (enrichedPendingAmountStudents.length > 0) {
          res.json(enrichedPendingAmountStudents);
      } else { 
          res.status(404).send("No students with pending amount found in the database.");
      }
  } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Failed to retrieve data");
  }
}


exports.deleteStudent = async (req, res) => {
    const studentId = req.params.id;
  
    const deleteQuery = "DELETE FROM student14 WHERE student_id = ?";
  
    try {
        await connection.query(deleteQuery, [studentId]);
        res.send('Student deleted successfully');
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).send('Error deleting student');
    }
};


// Assuming you have 'connection' set up to handle MySQL queries
exports.getStudentById = async (req, res) => {
    try {
        const { id: studentId } = req.params; // Rename id to studentId
        ; // Get student ID from request parameters
      console.log("Request parameters:", req.params);

      const studentQuery = `
        SELECT
          student_id, firstName, lastName, middleName, motherName,
          mobile_no, email, batch_year, subjectsId
        FROM
          student14
        WHERE
          student_id = ?;
      `;
      const [student] = await connection.query(studentQuery, [studentId]);
  
      console.log(student, studentId)
      if (student.length === 0) {
        res.status(404).send("Student not found");
        return;
      }
  
      // Assuming subjectsId contains comma-separated subject IDs
      const subjectQuery = `
        SELECT subjectId, subject_name FROM subjectsDb
        WHERE subjectId IN (?);
      `;
      const subjectsIds = student[0].subjectsId.split(',');
      const [subjects] = await connection.query(subjectQuery, [subjectsIds]);
  
      // Add subjects directly into the student object
      student[0].subjects = subjects.map(sub => ({
        subjectId: sub.subjectId,
        subject_name: sub.subject_name
      }));
  
      res.json(student[0]);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Failed to retrieve student data");
    }
  };