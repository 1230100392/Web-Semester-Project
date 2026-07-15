require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const Room = require('../models/Room')

const rooms = [
  {
    name: 'Deluxe Garden Room',
    type: 'Deluxe',
    price: 8500,
    totalUnits: 5,
    capacity: 2,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Garden View', 'Breakfast Included'],
    description:
      'A spacious room overlooking the garden courtyard, perfect for couples seeking a quiet, comfortable stay.'
  },
  {
    name: 'Executive Suite',
    type: 'Suite',
    price: 15500,
    totalUnits: 3,
    capacity: 3,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Mini Bar', 'City View', 'Work Desk', 'Breakfast Included'],
    description:
      'Premium suite with a separate living area, ideal for business travelers and small families.'
  },
  {
    name: 'Standard Twin Room',
    type: 'Standard',
    price: 5200,
    totalUnits: 8,
    capacity: 2,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Twin Beds'],
    description: 'A cozy and affordable room with two single beds, great for friends or colleagues.'
  },
  {
    name: 'Family Room',
    type: 'Family',
    price: 12000,
    totalUnits: 4,
    capacity: 4,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Two Queen Beds', 'Breakfast Included'],
    description: 'Generously sized room designed to comfortably host families with children.'
  },
  {
    name: 'Presidential Suite',
    type: 'Suite',
    price: 28000,
    totalUnits: 2,
    capacity: 4,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Private Balcony', 'Jacuzzi', 'Butler Service', 'Breakfast Included'],
    description: 'Our most luxurious offering, featuring panoramic views and dedicated concierge service.'
  },
  {
    name: 'Budget Single Room',
    type: 'Standard',
    price: 3200,
    totalUnits: 6,
    capacity: 1,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=800&q=80',
    amenities: ['Free Wi-Fi', 'Air Conditioning'],
    description: 'A compact, no-frills room for solo travelers on a budget.'
  }
]

async function seed() {
  await connectDB()
  await Room.deleteMany({})
  await Room.insertMany(rooms)
  console.log(`Seeded ${rooms.length} rooms successfully`)
  mongoose.connection.close()
}

seed()
