const { UnAuthenticatedError, BadRequestError } = require("../Error");
const User = require("../model/user");
const { StatusCodes } = require("http-status-codes");
const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["admin", "user"])
    .withMessage("Role must be either admin or user"),
];

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  try {
    const user = await User.create({ ...req.body });
    const token = await user.createJWT();
    res.status(StatusCodes.CREATED).json({ token });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide username and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ token });
};

module.exports = {
  login,
  register,
  validateRegister
};
