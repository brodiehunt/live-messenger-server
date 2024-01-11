const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get user account - should probably be /:userId ?
router.get("/", userController.getAccount);

// Search for users
router.get("/searchUsers", userController.searchUsers);

// The following 4 need to be update to patch not put
router.put("/name", userController.updateName);

router.put("/username", userController.updateUsername);

router.put("/email", userController.updateEmail);

router.put("/settings", userController.updateSettings);
// router.put('/newRequests', userController.resetRequests);

module.exports = router;
