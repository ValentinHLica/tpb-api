const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/ErrorHandler");
const Cors = require("./middleware/cors");
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// Dev only
// const dotenv = require("dotenv");
// dotenv.config({ path: "config/config.env" });

// Connect to Database
connectDB();

// Routes
const searchTorrents = require("./router/search");
const browseTorrents = require("./router/browse");
const recentTorrents = require("./router/recent");
const topTorrents = require("./router/top");
const torrent = require("./router/torrent");
const auth = require("./router/auth");
const bookmark = require("./router/bookmark");

// Cors
app.use(Cors);

app.use("/search", searchTorrents);
app.use("/browse", browseTorrents);
app.use("/recent", recentTorrents);
app.use("/top", topTorrents);
app.use("/torrent", torrent);
app.use("/auth", auth);
app.use("/bookmark", bookmark);

// ErrorHandler
app.use(ErrorHandler);

app.listen(process.env.PORT || 5000);
