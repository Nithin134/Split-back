
import Room from '../models/Room.js';
import User from '../models/User.js';
import validator from 'validator';
import { sendParticipantNotification } from '../utils/notification.js';

export const createRoom = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Room name is required" });

  const room = new Room({
    name,
    createdBy: req.user._id,
    participants: [{ user: req.user._id, addedBy: req.user._id }],
  });
  await room.save();
  res.status(201).json(room);
};

export const getMyRooms = async (req, res) => {
  const rooms = await Room.find({ createdBy: req.user._id });
  res.json(rooms);
};

export const addParticipants = async (req, res) => {
  const { roomId } = req.params;
  const { participants } = req.body;
  if (!Array.isArray(participants) || participants.length === 0) 
    return res.status(400).json({ message: "Participants array is required" });

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (!room.createdBy.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

  const usersToAdd = await User.find({
    $or: [
      { email: { $in: participants } },
      { phone: { $in: participants } }
    ],
  });

  const newParticipants = usersToAdd.filter(u => !room.participants.some(p => p.user.equals(u._id)));

  newParticipants.forEach(user => room.participants.push({ user: user._id, addedBy: req.user._id }));
  await room.save();

  newParticipants.forEach(user => sendParticipantNotification(user, room, req.user));
  res.json({ message: "Participants added", added: newParticipants.length });
};

export const getParticipants = async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findById(roomId).populate("participants.user", "name email phone");
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json(room.participants);
};

export const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (!room.createdBy.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

  await room.deleteOne();
  res.json({ message: "Room deleted" });
};

export const removeParticipant = async (req, res) => {
  const { roomId, participantId } = req.params;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (!room.createdBy.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

  room.participants = room.participants.filter(p => p.user.toString() !== participantId);
  await room.save();

  res.json({ message: "Participant removed" });
};
