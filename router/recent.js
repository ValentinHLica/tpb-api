const express = require("express");
const router = express.Router();

const recent = require("../controllers/recent");

router.get("/", recent);

module.exports = router;
