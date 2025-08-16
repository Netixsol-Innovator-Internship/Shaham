const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  })
}

// @desc    Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" })
    }

    // Create user
    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    })
  } catch (err) {
    console.error("Registration error:", err)
    res.status(500).json({ success: false, message: "Server error during registration" })
  }
}

// @desc    Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" })

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid)
      return res.status(401).json({ success: false, message: "Invalid email or password" })

    const token = generateToken(user._id)
    res.json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email }, token },
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ success: false, message: "Server error during login" })
  }
}

// @desc    Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    res.json({ success: true, data: { user } })
  } catch (err) {
    console.error("Get profile error:", err)
    res.status(500).json({ success: false, message: "Server error fetching profile" })
  }
}

module.exports = { registerUser, loginUser, getUserProfile }
