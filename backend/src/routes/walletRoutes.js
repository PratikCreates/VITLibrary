const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');

const {
  getWallet,
  addPaymentSource,
  addFunds,
  addUPI
} = require('../controllers/walletController');

router.get('/', verifyToken, getWallet);
router.post('/source', verifyToken, addPaymentSource);
router.post('/fund', verifyToken, addFunds);

// Routes for compatibility with older tests
router.post('/upi', verifyToken, addUPI);
router.post('/add', verifyToken, addFunds);

module.exports = router;
