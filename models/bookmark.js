const mongoose = require("mongoose");

const BookmarkTorrent = new mongoose.Schema({
  torrentId: {
    type: String,
    required: [true, "Please provide torrent id"],
  },
  title: {
    type: String,
    required: [true, "Please privide torrent title"],
  },
  magnet: {
    type: String,
    required: [true, "Please privide torrent magnet link"],
  },
  info: Object,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide user to bookmark torrent"],
  },
});

module.exports = mongoose.model("Bookmark", BookmarkTorrent);
