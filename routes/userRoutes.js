const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middlewares/verifyJWT");
// Middleware to verify JWT token
router.use(verifyJWT); // Protect all routes with JWT verification
// Route to get all users
router.route("/").get(userController.getAllUsers);
module.exports = router;
