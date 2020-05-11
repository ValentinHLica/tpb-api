const express = require("express");
const router = express.Router();

const browseTorrents = require("../controllers/browse");

router.get("/:category", browseTorrents);

module.exports = router;
