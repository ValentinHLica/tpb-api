const listTorrent = require("../utils/listTorrents");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;

  const url = `${process.env.URL}/recent/${page}`;

  const data = await listTorrent(url, false);

  if (data.error) {
    return next({
      name: "CostumError",
      message: "No torrents were found",
      statusCode: 404,
    });
  }

  res.status(200).json({
    success: true,
    data: data.torrents,
  });
};
