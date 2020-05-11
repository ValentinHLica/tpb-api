const listTorrent = require("../utils/listTorrents");

module.exports = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const sort = parseInt(req.query.sort, 10) || 7;
  const category = parseInt(req.query.category, 10) || 0;

  // URL
  const url = `${process.env.URL}/search/${req.params.query}/${page}/${sort}/${category}`;

  const data = await listTorrent(url, true, req, page);

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
      query: req.params.query,
      sort,
      category,
    },
    pagination: data.pagination,
    data: data.torrents,
  });
};
