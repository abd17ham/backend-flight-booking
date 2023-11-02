const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/admin/login", userController.adminLogin);
router.get("/logout", userController.logout);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:token", userController.resetPassword);

module.exports = router;
