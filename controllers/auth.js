const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Send Token
const sendToken = (res, statusCode, user) => {
  const token = user.sendToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// @desc       Register User
// @route      POST /auth/register
// @access     Public
exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    sendToken(res, 201, user);
  } catch (error) {
    next(error);
  }
};

// @desc       Login User
// @route      POST /auth/login
// @access     Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return next({
        name: "CostumError",
        message: "Please provide email address and password",
        statusCode: 400,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Credentials",
        statusCode: 400,
      });
    }

    const matchPassword = await user.matchPassword(password);

    if (!matchPassword) {
      return next({
        name: "CostumError",
        message: "Invalide Credentials",
        statusCode: 400,
      });
    }

    sendToken(res, 201, user);
  } catch (error) {
    next(error);
  }
};

// @desc       Forgot Password
// @route      POST /auth/forgotpassword
// @access     Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next({
        name: "CostumError",
        message: "User does not exist",
        statusCode: 400,
      });
    }

    const resetToken = await user.resetToken();

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: req.body.email,
      subject: "Reset Password",
      text: `Please click the link below to reset password
      ${req.protocol}://${process.env.SITE_URL}/resetpassword/${resetToken}
      `,
    });

    res.status(201).json({
      success: true,
      message: "Email Sent Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Reset Password
// @route      PUT /auth/resetpassword/:resettoken
// @access     Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gte: Date.now() },
    });

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Token",
        statusCode: 400,
      });
    }

    if (req.body.newPassword.length < 6) {
      return next({
        name: "CostumError",
        message: "Please provide a 7 characters or longer password",
        statusCode: 400,
      });
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save();

    sendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};

// @desc       Get User Details
// @route      GET /auth/user
// @access     Private
exports.getUserDetials = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Change User Details
// @route      PUT /auth/user/edit/details
// @access     Private
exports.changeDetails = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        email,
      },
      { runValidators: true, new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Change User Password
// @route      PUT /auth/user/edit/password
// @access     Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword && !newPassword) {
      return next({
        name: "CostumError",
        message: "Please provide current password and new password",
        statusCode: 400,
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    const matchPassword = await user.matchPassword(currentPassword);

    if (!matchPassword) {
      return next({
        name: "CostumError",
        message: "Please enter the correct password",
      });
    }

    user.password = newPassword;
    user.save();

    sendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};
