const connection = require('../config/db1');


exports.getSubjectIds = async (req,res) => {
    try{
     
        const sujectQuery = "SELECT * from subjectsDb"

        const subjctsids = await connection.query(sujectQuery)

        if (sujectQuery!== null) {
            res.json(subjctsids[0]);
        } else { 
            res.status(404).send("subject database not addded please add it")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}



exports.getCourses = async (req,res) => {
    try{
        
        const courseQuery = "SELECT * from coursesDb1"
        console.log('etching course')

        const courses = await connection.query(courseQuery)

        if (courseQuery!== null) {
            res.json(courses[0]);
        } else { 
            res.status(404).send("subject database not addded please add it")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}


exports.audiosFromId = async (req, res) => {
    try {
        // Extract subjectId from the request body
        const { subjectId } = req.body;
        const userId = req.session.studentId;

        // Check if subjectId and userId are provided
        if (!subjectId || !userId) {
            return res.status(400).send("No subject ID or user ID provided.");
        }

        // Prepare a parameterized query to fetch the student's payment status
        const paymentQuery = "SELECT amount FROM student14 WHERE student_id = ?";

        // Execute the query with the userId as a parameter
        const [paymentResult] = await connection.query(paymentQuery, [userId]);

        // Check if the payment status is found
        if (paymentResult.length > 0) {
            const { amount } = paymentResult[0];

            // Prepare a parameterized query to fetch audio records
            const audioQuery = "SELECT * FROM audiodb1 WHERE subjectId = ?";

            // Execute the query with the subjectId as a parameter
            const audioRecords = await connection.query(audioQuery, [subjectId]);

            // Check if any audio records are found
            if (audioRecords.length > 0) {
                // If the student has paid, send all audio records
                if (amount === 'paid') {
                    res.json(audioRecords[0]);
                } else {
                    // If the student hasn't paid, send only the first two records
                    res.json(audioRecords[0].slice(0, 2));
                }
            } else {
                res.status(404).send("No audio records found for the provided subject ID.");
            }
        } else {
            res.status(404).send("No payment status found for the provided user ID.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};