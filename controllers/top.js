const listTorrent = require("../utils/listTorrents");

module.exports = async (req, res, next) => {
  const category = parseInt(req.params.category, 10);

  const url = `${process.env.URL}/top/${category}`;

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
    category,
    data: data.torrents,
  });
};
