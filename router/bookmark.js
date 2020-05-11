const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const {
  getBookmarks,
  bookmarkTorrent,
  bookmarkCheck,
  removeBookmark,
} = require("../controllers/bookmark");

router.get("/", protect, getBookmarks);
router.post("/", protect, bookmarkTorrent);
router.get("/:torrentid", protect, bookmarkCheck);
router.delete("/:torrentid", protect, removeBookmark);

module.exports = router;
