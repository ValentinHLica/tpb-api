const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUserDetials,
  changeDetails,
  changePassword,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/user", protect, getUserDetials);
router.put("/user/edit/details", protect, changeDetails);
router.put("/user/edit/password", protect, changePassword);

module.exports = router;
