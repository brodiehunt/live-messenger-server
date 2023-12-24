const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAccount);
router.get('/searchUsers', userController.searchUsers);
router.put('/name', userController.updateName);
router.put('/username', userController.updateUsername);
router.put('/email', userController.updateEmail);
router.put('/settings', userController.updateSettings);


module.exports = router;