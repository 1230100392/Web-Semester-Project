const Booking = require('../models/Booking')
const Room = require('../models/Room')

// POST /api/bookings  (logged-in user)
async function createBooking(req, res, next) {
  try {
    const { roomId, fullName, email, checkIn, checkOut, guests } = req.body

    const room = await Room.findById(roomId)
    if (!room) return res.status(404).json({ message: 'Room not found' })

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' })
    }

    const activeBookings = await Booking.countDocuments({
      room: room._id,
      status: { $in: ['pending', 'confirmed'] }
    })

    if (activeBookings >= room.totalUnits) {
      return res.status(400).json({
        message: 'No units of this room are currently available. Please choose another room.'
      })
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      fullName,
      email,
      checkIn,
      checkOut,
      guests,
      status: 'pending' // every new booking waits for admin approval
    })

    const populatedBooking = await booking.populate('room')
    res.status(201).json(populatedBooking)
  } catch (error) {
    next(error)
  }
}

// GET /api/bookings/my  (logged-in user's own bookings)
async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    next(error)
  }
}

// GET /api/bookings  (admin only — all bookings)
async function getAllBookings(req, res, next) {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    next(error)
  }
}

// PUT /api/bookings/:id/status  (admin only)
async function updateBookingStatus(req, res, next) {
  try {
    const { status } = req.body
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json(booking)
  } catch (error) {
    next(error)
  }
}

// PUT /api/bookings/:id/cancel  (the logged-in user who owns the booking)
async function cancelMyBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'This booking is already cancelled' })
    }

    booking.status = 'cancelled'
    await booking.save()

    const populatedBooking = await booking.populate('room')
    res.json(populatedBooking)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBooking
}
