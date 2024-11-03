const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.post('/',userController.addUser);
router.post('/login',userController.loginUser);
router.get('/:id', verifyToken, userController.getUserName);


module.exports = router;