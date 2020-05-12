const cheerio = require("cheerio");
const axios = require("axios");

module.exports = async (req, res, next) => {
  const data = { title: null, magnet: null, descPre: null, info: {} };

  const url = `${process.env.URL}/torrent/${req.params.id}`;

  let error = false;

  await axios
    .get(url)
    .then((Torrent) => {
      const $ = cheerio.load(Torrent.data);

      // Title
      data.title = $("#title").text().trim();

      // Category
      data.info.type = $('a[title="More from this category"]')
        .text()
        .trim()
        .split(" > ");

      // File nr
      data.info.files = $("#details").find('a[title="Files"]').text();

      // Size
      data.info.size = $("#details .col1 :nth-child(6)").text().trim();

      // Comments
      const comments = [];
      // Loop thru the comments
      $("#comments div").each((i, element) => {
        // Get comment
        const comment = $(element).find("p.byline").text().trim().split(" ");
        // Show info about the comment like: User, Date, Time, timeZone and text
        const commentOb = {
          user: $(element).find(".byline a").text(),
          commentInfo: {
            date: comment[2],
            time: comment[3],
            timeZone: comment[4] === "CET:" ? "CET" : "CET",
            text: $(element).find(".comment").text().trim(),
          },
        };

        // Check if Uploader is VIP #1
        if (
          $(element).find('.byline img[title="VIP"]').attr("title") === "VIP"
        ) {
          commentOb.commentInfo.vip = true;
        }

        // Check if Uploader is VIP #2
        if (
          $(element).find('.byline img[title="Trusted"]').attr("title") ===
          "VIP"
        ) {
          commentOb.commentInfo.trusted = true;
        }

        // Check if there are any comments
        if (comment[2]) {
          comments.push(commentOb);
        }
      });

      // Comments
      data.info.comments = comments;

      // Check if torrent(that is a movie) has IMDB
      if ($('a[title="IMDB"]').attr("title") === "IMDB") {
        data.info.imdbID = $('a[title="IMDB"]').attr("href").split("/")[
          $('a[title="IMDB"]').attr("href").split("/").length - 2
        ];
      }

      // Check torrent(that is a movie) what lang its in #1
      if (
        $("#details .col1 :nth-child(9)").text().split("(s):")[0] + "(s):" ===
        "Spoken language(s):"
      ) {
        data.info.lang = $("#details .col1 :nth-child(10)").text();
      }

      // Check torrent(that is a movie) what lang its in #2
      if (
        $("#details .col1 :nth-child(10)").text().split("(s):")[0] + "(s):" ===
        "Spoken language(s):"
      ) {
        data.info.lang = $("#details .col1 :nth-child(11)").text();
      }

      // Check if torrent(that is a movie) has sub and in what lang
      if ($("#details .col1 :nth-child(12)").text() === "Texted language(s):") {
        data.info.subtitle = $("#details .col1 :nth-child(13)").text();
      }

      // Check if torrent has Tags
      if (
        $("#details .col1 :nth-last-child(2)").text().split("(s):")[0] +
          "(s):" ===
        "Tag(s):"
      ) {
        let tags = [];
        // Loop thru every tag
        $("#details .col1 :last-child a").each((i, e) => {
          tags.push($(e).text());
        });

        data.info.tags = tags;
      }

      // Comments nr
      data.info.commentsNumber = $("#NumComments").text();

      // Magnet Link
      data.magnet = $("#details .download")
        .find('a[title="Get this torrent"]')
        .attr("href");

      // Description
      data.descPre = $("#details .nfo pre").text().trim();

      // Does not work anymore
      // Check if torrent(that is a movie) can be streamed
      // if (
      //   $("#details .download")
      //     .find('a[title="PLAY/STREAM TORRENT"]')
      //     .attr("title") === "PLAY/STREAM TORRENT"
      // ) {
      //   // Stream url
      //   data.stream =
      //     "https://thepiratebay.org" +
      //     $("#details .download")
      //       .find('a[title="PLAY/STREAM TORRENT"]')
      //       .attr("href");
      // }

      // Get Data from Col2 if its not empty
      // For more info please read README.md
      if (
        $(".col2 :nth-child(1)").text().split("ed:")[0] + "ed:" ===
        "Uploaded:"
      ) {
        //  Uploaded date, time and timeZone
        let createdInfo = $(".col2 :nth-child(2)").text().trim().split(" ");

        data.info.uploaded = {
          date: createdInfo[0],
          time: createdInfo[1],
          timeZone: createdInfo[2],
        };

        // Torrent Detail like: Author, Seeds, Leeches and HashInfo
        data.info.detail = {
          author: $(".col2 :nth-child(4)").text().trim(),
          seeders: $(".col2 :nth-child(6)").text(),
          leechers: $(".col2 :nth-child(8)").text(),
          hashInfo: $(".col2")
            .text()
            .trim()
            .split(" ")
            .join("")
            .trim()
            .split("Hash:")[1]
            .trim(),
        };
      }

      // Check if col2 is empty
      // For more info please read README.md
      if (!$("#details .col2").find("dd").length) {
        // Get col1 text and filter thru it to remove blank
        const torrentInfoCol1 = $("#details .col1")
          .text()
          .trim()
          .split(" ")
          .filter((e) => e !== "")
          .join("")
          .trim()
          .split("\n");

        // More filtering
        const col1 = torrentInfoCol1.filter((e) => e !== "");

        // Havent yet goten the tags ill do it later :) TODO
        data.info.tags = null;

        //  Uploaded date, time and timeZone
        const uploaded = col1[col1.indexOf("Uploaded:") + 1];
        data.info.uploaded = {
          date: uploaded.slice(0, 10),
          time: uploaded.slice(10, 18),
          timeZone: uploaded.slice(18, 21),
        };

        // Torrent Detail like: Author, Seeds, Leeches and HashInfo
        data.info.detail = {
          author: col1[col1.indexOf("By:") + 1],
          seeders: col1[col1.indexOf("Seeders:") + 1],
          leechers: col1[col1.indexOf("Leechers:") + 1],
          hashInfo: col1[col1.length - 1],
        };
      }
    })
    .catch(() => {
      error = true;
    });

  if (error) {
    return next({
      name: "CostumError",
      message: "Torrent does not exist",
      statusCode: 404,
    });
  }

  res.status(200).json({
    success: true,
    data: data,
  });
};
