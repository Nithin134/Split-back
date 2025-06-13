import Expense from '../models/Expense.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import { sendExpenseNotification } from '../utils/notification.js';

// ✅ Add Expense
export const addExpense = async (req, res) => {
  const { roomId } = req.params;
  const { description, category, amount, participants, paidBy } = req.body;

  if (!description || !amount || !Array.isArray(participants) || participants.length === 0 || !paidBy) {
    return res.status(400).json({ message: "Please provide all required expense fields" });
  }

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });

  const allowedIds = room.participants.map(p => p.user.toString());
  if (!allowedIds.includes(paidBy)) return res.status(403).json({ message: "Payer not a room participant" });

  for (const pid of participants) {
    if (!allowedIds.includes(pid)) {
      return res.status(400).json({ message: "Some participants are not part of the room" });
    }
  }

  const expense = new Expense({
    room: roomId,
    paidBy,
    description,
    category,
    amount,
    participants,
  });

  await expense.save();

  const paidByUser = await User.findById(paidBy);
  sendExpenseNotification(expense, room, paidByUser);

  res.status(201).json(expense);
};

// ✅ Get Expenses by Room
export const getExpensesByRoom = async (req, res) => {
  const { roomId } = req.params;

  const expenses = await Expense.find({ room: roomId })
    .populate("paidBy", "name email phone")
    .populate("participants", "name email phone");

  res.json(expenses);
};

// ✅ Dashboard Stats
export const getDashboardStats = async (req, res) => {
  const rooms = await Room.find({ createdBy: req.user._id });
  const roomIds = rooms.map(r => r._id);

  const numberRoomsCreated = rooms.length;
  const numberRoomsActive = rooms.filter(r => r.isActive).length;

  const participantsSet = new Set();
  rooms.forEach(r => r.participants.forEach(p => participantsSet.add(p.user.toString())));
  const numberParticipants = participantsSet.size;

  const expenses = await Expense.find({ room: { $in: roomIds } });
  const numberExpenses = expenses.length;

  res.json({ numberRoomsCreated, numberRoomsActive, numberParticipants, numberExpenses });
};

// ✅ Settlement Calculation
export const getRoomSettlements = async (req, res) => {
  const { roomId } = req.params;

  const expenses = await Expense.find({ room: roomId })
    .populate("paidBy", "name email")
    .populate("participants", "name email");

  const balances = {};

  for (const exp of expenses) {
    const share = exp.amount / exp.participants.length;

    for (const participant of exp.participants) {
      const debtorId = participant._id.toString();
      const creditorId = exp.paidBy._id.toString();

      if (debtorId === creditorId) continue;

      if (!balances[debtorId]) balances[debtorId] = {};
      if (!balances[debtorId][creditorId]) balances[debtorId][creditorId] = 0;

      balances[debtorId][creditorId] += share;
    }
  }

  const settlements = [];
  for (const debtor in balances) {
    for (const creditor in balances[debtor]) {
      settlements.push({
        from: debtor,
        to: creditor,
        amount: Math.abs(balances[debtor][creditor]).toFixed(2),
      });
    }
  }

  const userIds = [...new Set(settlements.flatMap(s => [s.from, s.to]))];
  const users = await User.find({ _id: { $in: userIds } });
  const userMap = {};
  users.forEach(u => { userMap[u._id.toString()] = u.name; });

  const final = settlements.map(s => ({
    from: userMap[s.from],
    to: userMap[s.to],
    amount: s.amount,
  }));

  res.json(final);
};

// ✅ Delete Expense
export const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  // Only the one who paid can delete
  if (!expense.paidBy.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

  await expense.deleteOne();
  res.json({ message: "Expense deleted" });
};
