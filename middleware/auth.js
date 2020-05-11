const User = require("../models/user");
const jwt = require("jsonwebtoken");
// Protect Rotes
exports.protect = async (req, res, next) => {
  try {
    let token;

    const auth = req.headers.authorization;

    if (auth && auth.startsWith("Bearer")) {
      token = auth.split(" ")[1];
    }

    if (!token) {
      return next({
        name: "CostumError",
        message: "Please provide authorization",
        statusCode: 400,
      });
    }

    const decoder = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoder.id);

    if (!user) {
      return next({
        name: "CostumError",
        message: "Please provide valid token",
        statusCode: 400,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
