const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refresh);
module.exports = router;
