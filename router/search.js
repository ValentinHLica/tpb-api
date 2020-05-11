const express = require("express");
const router = express.Router();

const searchTorrent = require("../controllers/search");

router.get("/:query", searchTorrent);

module.exports = router;
