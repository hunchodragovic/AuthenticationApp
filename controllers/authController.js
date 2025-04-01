const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const foundUser = await User.findOne({ email }).exec(); // Use await here for async operation
  if (foundUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({ name, email, password: hashedPassword });

  // Save user to the database
  await newUser.save();

  // Generate access token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Set refresh token in HTTP-only cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true, // Ensure this is true only if you're using https
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send the response with accessToken and user data
  res.json({
    accessToken,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, foundUser.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate access token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Set refresh token in HTTP-only cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true, // Ensure this is true only if you're using HTTPS
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send the response with accessToken and user data
  res.json({
    accessToken,
    user: {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
    },
  });
};

module.exports = { login, register };
