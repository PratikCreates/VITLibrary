const { prisma } = require('../prisma/client');
const { Prisma } = require('@prisma/client');


const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { validateStudent, validateEmployee } = require('../validators/authValidator');


exports.registerStudent = async (req, res) => {
    try {
        const error = validateStudent(req.body);
        if (error) return res.status(400).json({ error });

        if (isNaN(Date.parse(req.body.dob))) {
            return res.status(400).json({ error: "Invalid date of birth" });
        }

        const hashed = await hashPassword(req.body.password);

        await prisma.account.create({
            data: {
                role: "STUDENT",
                name: req.body.name,
                email: req.body.email,
                dob: new Date(req.body.dob + "T00:00:00.000Z"),
                password_hash: hashed,
                student: {
                    create: {
                        register_number: req.body.register_number
                    }
                },
                wallet: {
                    create: {}
                }
            }
        });

        return res.status(200).json({ message: "Student registered" });
    }
    catch (e) {

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return res.status(409).json({ error: "User already registered" });
            }
        }

        return res.status(500).json({ error: "Registration failed" });
    }
};


exports.registerEmployee = async (req, res) => {
    try {
        const error = validateEmployee(req.body);
        if (error) return res.status(400).json({ error });

        if (isNaN(Date.parse(req.body.dob))) {
            return res.status(400).json({ error: "Invalid date of birth" });
        }

        const hashed = await hashPassword(req.body.password);

        await prisma.account.create({
            data: {
                role: "EMPLOYEE",
                name: req.body.name,
                email: req.body.email,
                dob: new Date(req.body.dob + "T00:00:00.000Z"),
                password_hash: hashed,
                verificationStatus: "VERIFIED",
                employee: {
                    create: {
                        employee_code: req.body.employee_code
                    }
                },
                wallet: {
                    create: {}
                }
            }
        });

        return res.status(200).json({ message: "Employee registered" });
    }
    catch (e) {

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return res.status(409).json({ error: "User already registered" });
            }
        }

        return res.status(500).json({ error: "Registration failed" });
    }
};

exports.login = async (req, res) => {
    const { identity, password, role } = req.body;

    let account = null;

    if (identity.includes('@')) {
        // Login by email
        account = await prisma.account.findUnique({
            where: { email: identity }
        });

        // Ensure account role matches requested role
        if (account && account.role !== role) {
            return res.status(401).json({ error: "Invalid credentials for this role" });
        }
    } else {
        // Login by code
        if (role === "STUDENT") {
            const student = await prisma.student.findUnique({
                where: { register_number: identity },
                include: { account: true }
            });
            if (student) account = student.account;
        } else {
            const employee = await prisma.employee.findUnique({
                where: { employee_code: identity },
                include: { account: true }
            });
            if (employee) account = employee.account;
        }
    }

    if (!account) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await comparePassword(password, account.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(account);

    res.status(200).json({ token });
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Direct check for admin accounts
    const account = await prisma.account.findUnique({
        where: { email }
    });

    if (!account || account.role !== 'ADMIN') {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    const valid = await comparePassword(password, account.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(account);
    res.status(200).json({ token });
};
