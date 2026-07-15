const express = require('express')
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getRooms)
router.get('/:id', getRoomById)
router.post('/', protect, adminOnly, createRoom)
router.put('/:id', protect, adminOnly, updateRoom)
router.delete('/:id', protect, adminOnly, deleteRoom)

module.exports = router
