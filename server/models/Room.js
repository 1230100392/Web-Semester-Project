const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Standard', 'Deluxe', 'Suite', 'Family']
    },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    totalUnits: { type: Number, required: true, min: 0, default: 5 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    image: { type: String, required: true },
    amenities: { type: [String], default: [] },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Room', roomSchema)
