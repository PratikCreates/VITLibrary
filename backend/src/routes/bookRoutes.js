const router = require('express').Router();
const controller = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', controller.getAllBooks);
router.get('/:id', controller.getBookById);

// Admin only routes
router.post('/', verifyToken, isAdmin, controller.addBook);
router.put('/:id', verifyToken, isAdmin, controller.updateBook);
router.delete('/:id', verifyToken, isAdmin, controller.deleteBook);

module.exports = router;
