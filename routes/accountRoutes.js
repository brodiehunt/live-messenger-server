const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');


router.put('/name', accountController.updateName);
router.put('/username', accountController.updateUsername);
router.put('/email', accountController.updateEmail);
router.put('/settings', accountController.updateSettings);


module.exports = router;