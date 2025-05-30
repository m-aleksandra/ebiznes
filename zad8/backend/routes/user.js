const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/:id', verifyToken, userController.getUser);

module.exports = router;