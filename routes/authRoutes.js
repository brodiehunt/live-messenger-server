const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// AUTH ROUTES

router.post('/signin', authController.signin);

router.post('/register', authController.register);

// router.post('/google/')

// router.get('/google')

module.exports = router;