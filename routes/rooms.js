



import express from 'express';
import {
  createRoom,
  getMyRooms,
  addParticipants, deleteRoom,
  removeParticipant,
  getParticipants
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Specific parameterized routes FIRST
router.post('/:roomId/participants', protect, addParticipants);
router.get('/:roomId/participants', protect, getParticipants);


// ✅ Then general routes
router.post('/', protect, createRoom);
router.get('/mine', protect, getMyRooms); // ✅ use /mine instead of plain /
router.delete('/:roomId/participants/:participantId', protect, removeParticipant);
router.delete('/:roomId', protect, deleteRoom);


export default router;