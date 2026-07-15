const jwt = require('jsonwebtoken')
const User = require('../models/User')

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// POST /api/auth/register
async function registerUser(req, res, next) {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide fullName, email, and password' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const user = await User.create({ fullName, email, password })

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/me
async function getCurrentUser(req, res, next) {
  try {
    res.json(req.user)
  } catch (error) {
    next(error)
  }
}

module.exports = { registerUser, loginUser, getCurrentUser }
