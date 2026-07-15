require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const User = require('../models/User')

// Hardcoded admin credentials — not exposed via any public registration route.
// Change these before deploying anywhere beyond local development.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@stayease.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345'
const ADMIN_NAME = 'StayEase Admin'

async function seedAdmin() {
  await connectDB()

  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    existing.role = 'admin'
    await existing.save()
    console.log(`Admin account already existed — role confirmed for ${ADMIN_EMAIL}`)
  } else {
    await User.create({
      fullName: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    })
    console.log(`Admin account created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  }

  mongoose.connection.close()
}

seedAdmin()
