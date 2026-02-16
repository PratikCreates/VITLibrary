const router = require('express').Router();
const controller = require('../controllers/authController');

router.post('/register/student', controller.registerStudent);
router.post('/register/employee', controller.registerEmployee);
router.post('/login', controller.login);
router.post('/admin/login', controller.adminLogin);

module.exports = router;
