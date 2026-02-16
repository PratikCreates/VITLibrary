const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const controller = require('../controllers/kycController');

router.post('/upload', verifyToken, upload.single('document'), controller.uploadDocument);

module.exports = router;
