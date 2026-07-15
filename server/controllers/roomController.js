const Room = require('../models/Room')
const Booking = require('../models/Booking')

// Attaches bookedUnits / availableUnits to each room by counting active
// (pending or confirmed) bookings against that room's totalUnits.
async function withAvailability(rooms) {
  const roomIds = rooms.map((r) => r._id)

  const counts = await Booking.aggregate([
    { $match: { room: { $in: roomIds }, status: { $in: ['pending', 'confirmed'] } } },
    { $group: { _id: '$room', count: { $sum: 1 } } }
  ])

  const countMap = {}
  counts.forEach((c) => {
    countMap[c._id.toString()] = c.count
  })

  return rooms.map((room) => {
    const obj = room.toObject ? room.toObject() : room
    const bookedUnits = countMap[room._id.toString()] || 0
    const availableUnits = Math.max(0, obj.totalUnits - bookedUnits)
    return { ...obj, bookedUnits, availableUnits }
  })
}

// GET /api/rooms  (supports ?type=Suite&search=deluxe)
async function getRooms(req, res, next) {
  try {
    const { type, search } = req.query
    const filter = {}

    if (type && type !== 'All') filter.type = type
    if (search) filter.name = { $regex: search, $options: 'i' }

    const rooms = await Room.find(filter).sort({ createdAt: -1 })
    const roomsWithAvailability = await withAvailability(rooms)
    res.json(roomsWithAvailability)
  } catch (error) {
    next(error)
  }
}

// GET /api/rooms/:id
async function getRoomById(req, res, next) {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) return res.status(404).json({ message: 'Room not found' })
    const [roomWithAvailability] = await withAvailability([room])
    res.json(roomWithAvailability)
  } catch (error) {
    next(error)
  }
}

// POST /api/rooms  (admin only)
async function createRoom(req, res, next) {
  try {
    const room = await Room.create(req.body)
    res.status(201).json(room)
  } catch (error) {
    next(error)
  }
}

// PUT /api/rooms/:id  (admin only)
async function updateRoom(req, res, next) {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!room) return res.status(404).json({ message: 'Room not found' })
    res.json(room)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/rooms/:id  (admin only)
async function deleteRoom(req, res, next) {
  try {
    const room = await Room.findByIdAndDelete(req.params.id)
    if (!room) return res.status(404).json({ message: 'Room not found' })
    res.json({ message: 'Room deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom }
