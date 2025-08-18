const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid.",
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid.",
    })
  }
}

const adminAuth = async (req, res, next) => {
  try {
    // First run the regular auth middleware
    await new Promise((resolve, reject) => {
      auth(req, res, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      })
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed.",
    })
  }
}

module.exports = { auth, adminAuth }
