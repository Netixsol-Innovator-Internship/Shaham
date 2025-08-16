const express = require("express")
const { body } = require("express-validator")
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController")
const auth = require("../middleware/auth")
const validateRequest = require("../middleware/validateRequest")

const router = express.Router()

// Validation rules
const registerValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and a number"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Routes
router.post("/register", registerValidation, validateRequest, registerUser)
router.post("/login", loginValidation, validateRequest, loginUser)
router.get("/profile", auth, getUserProfile)

module.exports = router
