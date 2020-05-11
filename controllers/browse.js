const listTorrent = require("../utils/listTorrents");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const sort = parseInt(req.query.sort, 10) || 7;

  // Url
  const url = `${process.env.URL}/browse/${req.params.category}/${page}/${sort}`;

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
    settings: {
      page,
      sort,
      category: Number(req.params.category),
    },
    data: data.torrents,
  });
};
