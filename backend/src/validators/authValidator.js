const studentReg = /^[1-2][0-9][A-Z]{3}[0-9]{4}$/;
const studentEmail = /^[a-z]+\.[a-z]+[0-9]{4}@vitstudent\.ac\.in$/;
const employeeEmail = /^[a-z0-9._]+@vit\.ac\.in$/;
const employeeCode = /^[0-9]{5}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_-])[A-Za-z\d@$!%*?&#^()_-]{8,}$/;

function validateStudent(data) {
    if (!studentReg.test(data.register_number)) return "Invalid register number format (e.g. 21BCE0001)";
    if (!studentEmail.test(data.email)) return "Invalid student email format (e.g. first.last2021@vitstudent.ac.in)";
    if (!passwordRegex.test(data.password)) return "Password must be at least 8 characters long, include uppercase, lowercase, number and special character";
    return null;
}

function validateEmployee(data) {
    if (!employeeCode.test(data.employee_code)) return "Invalid employee code format (5 digits)";
    if (!employeeEmail.test(data.email)) return "Invalid employee email format (e.g. name@vit.ac.in)";
    if (!passwordRegex.test(data.password)) return "Password must be at least 8 characters long, include uppercase, lowercase, number and special character";
    return null;
}

module.exports = { validateStudent, validateEmployee };
