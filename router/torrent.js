const express = require("express");
const router = express.Router();

const torrent = require("../controllers/torrent");

router.get("/:id", torrent);

module.exports = router;
