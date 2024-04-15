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

        // Check if subjectId is provided
        if (!subjectId) {
            return res.status(400).send("No subject ID provided.");
        }

        // Prepare a parameterized query
        const courseQuery = "SELECT * FROM audiodb1 WHERE subjectId = ?";

        console.log('Fetching courses for subject ID:', subjectId);

        // Execute the query with the subjectId as a parameter
        const courses = await connection.query(courseQuery, [subjectId]);

        // Check if any courses are found
        if (courses.length > 0) {
            res.json(courses[0]);
        } else {
            res.status(404).send("No courses found for the provided subject ID.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);

        
    }
};