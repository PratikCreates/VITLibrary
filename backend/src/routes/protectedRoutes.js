const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

router.get('/me', verifyToken, (req, res) => {
    res.json({
        id: req.user.id,
        role: req.user.role,
        name: req.user.name
    });
});

router.get('/student-only',
    verifyToken,
    allowRoles('STUDENT'),
    (req, res) => {
        res.json({ message: "Student access granted" });
    }
);

router.get('/employee-only',
    verifyToken,
    allowRoles('EMPLOYEE'),
    (req, res) => {
        res.json({ message: "Employee access granted" });
    }
);

module.exports = router;
