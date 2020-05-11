const express = require("express");
const router = express.Router();

const topTorrents = require("../controllers/top");

router.get("/:category", topTorrents);

module.exports = router;
