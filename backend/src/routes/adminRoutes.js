const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const controller = require('../controllers/adminController');

// All admin routes are protected and require ADMIN role
router.use(verifyToken, allowRoles('ADMIN'));

router.get('/stats', controller.getStats);
router.get('/users', controller.getAllUsers);
router.get('/bookings', controller.getAllBookings);
router.post('/kyc/verify', controller.updateKycStatus);

module.exports = router;
