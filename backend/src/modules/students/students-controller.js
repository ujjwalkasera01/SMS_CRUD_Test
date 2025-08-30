const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent , deleteStudent} = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, className, section, roll } = req.query;

    try {
        const students = await getAllStudents({ name, className, section, roll });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found matching the provided filters." });
        }

        res.status(200).json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "An error occurred while fetching students." });
    }
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;

    try {
        const message = await addNewStudent(payload);
        res.status(201).json({ message });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "An error occurred while adding the student." });
    }
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = { ...req.body, userId: id };

    try {
        const message = await updateStudent(payload);
        res.status(200).json({ message });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "An error occurred while updating the student." });
    }
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const student = await getStudentDetail(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ error: "An error occurred while fetching student details." });
    }
});


const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id: userId } = req.params; 
    const { status } = req.body;  
    const { id: reviewerId } = req.params;  

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    try {
        const message = await setStudentStatus({ userId, reviewerId, status });
        res.status(200).json(message);
    } catch (error) {
        console.error("Error updating student status:", error);
        res.status(500).json({ error: "An error occurred while updating student status" });
    }
});

const handleDeleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const message = await deleteStudent(id);
        res.status(200).json(message);  
    } catch (error) {
        console.error("Error deleting student:", error.message);
        res.status(error.statusCode || 500).json({
            error: "An error occurred while deleting student.",
        });  
    }
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent
};
