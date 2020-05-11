const axios = require("axios");
const cheerio = require("cheerio");
module.exports = listTorrent = async (url, usePagination, req, page) => {
  // Array of Torrents
  const torrents = [];

  // Paggination
  const pagination = {};

  // Error
  let error = false;

  // Fetch Torrents Results
  await axios
    .get(url)
    .then((Torrents) => {
      const $ = cheerio.load(Torrents.data);

      // Loop thru the torrents
      $("tbody tr").each((i, el) => {
        // Last tr is site pagination that why if statment
        if ($(el).find(".detName a").attr("href") !== undefined) {
          // Get Single torrent
          const torrent = {
            //Torrent ID
            id: $(el).find(".detName a").attr("href").split("/")[2],
            // Title
            title: $(el).find(".detName a").text(),
            // URL Link (not very important)
            link: $(el).find('a[class="detLink"]').attr("href"),
            // Magnet Link
            magnet: $(el)
              .find('a[title="Download this torrent using magnet"]')
              .attr("href"),
            // Info about the upload: Date, Size, Type, Category, Seeds and Peers
            info: {
              // Uploader
              uploader:
                $(el).find("a.detDesc").text() !== ""
                  ? $(el).find("a.detDesc").text()
                  : "Anonymous",
              // Date
              uploadDate: $(el)
                .find(":nth-child(2) :last-child")
                .text()
                .split("Uploaded")[1]
                .split(",")[0]
                .trim(),
              // Size
              size: $(el)
                .find(":nth-child(2) :last-child")
                .text()
                .split("Uploaded")[1]
                .split(",")[1]
                .trim()
                .split("Size")[1]
                .trim(),
              // Type (Audio, Video, Application, Games, Porn, Other)
              type: $(el).find(".vertTh center :nth-child(1)").text(),
              // Category (Music, Movie, Windows etc)
              category: $(el).find(".vertTh center :last-child").text(),
              // Seeds
              seeders: $(el).find(":nth-last-child(2)").text(),
              // Peers
              leechers: $(el).find(":nth-child(4)").text(),

              // Check if Torrent has any Comments
              comments:
                $(el)
                  .find(
                    'img[src="//thepiratebay.org/static/img/icon_comment.gif"]'
                  )
                  .attr("src") ===
                "//thepiratebay.org/static/img/icon_comment.gif"
                  ? $(el)
                      .find(
                        'img[src="//thepiratebay.org/static/img/icon_comment.gif"]'
                      )
                      .attr("title")
                  : "No comments",
              // Check if Uploader is VIP or Trusted
              [$(el).find('img[alt="VIP"]').attr("alt") === "VIP"
                ? "vip"
                : "trusted"]: true,
            },
          };
          // If torrent (that is a movie) has a Stream Link
          // Stream Link
          if (
            $(el).find('a[title="Play now using Baystream"]').attr("title") ===
            "Play now using Baystream"
          ) {
            torrent.stream = `https://thepiratebay.org${$(el)
              .find('a[title="Play now using Baystream"]')
              .attr("href")}`;
          }

          // Push torrent to torrents array
          torrents.push(torrent);
        }
      });

      if (usePagination) {
        // Pagiantion
        if ($("#main-content").text().trim() !== "") {
          const h2 = $("body")
            .find("h2")
            .text()
            .split("Displaying hits from")[1]
            .trim()
            .split(" ");

          // Next Page
          if (Number(h2[4]) > Number(h2[2])) {
            pagination.nextPage = page + 1;
          }
          // Previous Page
          if (h2[0] > 0) {
            pagination.prevPage = page - 1;
          }
          // Last Page Number
          pagination.lastPage = Math.ceil(Number(h2[4]) / 30);
          // Page Number
          pagination.currentPage = page;
          // How many results
          pagination.results = Number(h2[2]);
        }
      }
    })
    .catch(() => {
      error = true;
    });

  return { torrents, pagination, error };
};
