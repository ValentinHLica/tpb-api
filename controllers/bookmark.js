const Bookmark = require("../models/bookmark");

// @desc       Get Bookmarks
// @route      GET /bookmark
// @access     Private
exports.getBookmarks = async (req, res, next) => {
  try {
    let query;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bookmark.countDocuments({ user: req.user._id });
    const paggination = { limit, count: total };

    if (startIndex > 0) {
      paggination.prevPage = page - 1;
    }

    if (total > endIndex) {
      paggination.nextPage = page + 1;
    }

    query = Bookmark.find({ user: req.user.id });

    query = query.skip(startIndex).limit(limit);

    const data = await query;

    res.status(200).json({
      success: true,
      paggination,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Create Bookmarks
// @route      POST /bookmark
// @access     Private
exports.bookmarkTorrent = async (req, res, next) => {
  try {
    // Check if Torrent id already bookmarked
    const torrent = await Bookmark.findOne({
      user: req.user.id,
      id: req.body.id,
    });

    if (torrent) {
      return next({
        name: "CostumError",
        message: "Torrent is already bookmarked",
        statusCode: 400,
      });
    }

    const data = await Bookmark.create({ ...req.body, user: req.user.id });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Check if Torrent is bookmarked
// @route      GET /bookmark/:torrentid
// @access     Private
exports.bookmarkCheck = async (req, res, next) => {
  try {
    // Check if Torrent id already bookmarked
    const torrent = await Bookmark.findOne({
      user: req.user.id,
      torrentId: req.params.torrentid,
    });

    if (torrent) {
      return next({
        name: "CostumError",
        message: "Torrent is already bookmarked",
        statusCode: 400,
      });
    }

    res.status(200).json({
      success: true,
      message: "Torrent is not bookmarked",
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Unbookmark Torrent
// @route      DELETE /bookmark/:torrentid
// @access     Private
exports.removeBookmark = async (req, res, next) => {
  try {
    const torrent = await Bookmark.findOne({
      user: req.user._id,
      torrentId: req.params.torrentid,
    });

    if (!torrent) {
      return next({
        name: "CostumError",
        message: "Torrent is not bookmarked",
        statusCode: 404,
      });
    }

    torrent.remove();

    res.status(200).json({
      success: true,
      message: "Torrent was removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
