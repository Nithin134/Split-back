import express from 'express';
import { addExpense, getExpensesByRoom,getRoomSettlements, getDashboardStats,deleteExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();



router.post('/:roomId', protect, addExpense);
router.get('/:roomId', protect, getExpensesByRoom);
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/:roomId/settlements', protect, getRoomSettlements);
router.delete('/:roomId/:expenseId', protect, deleteExpense);



export default router;
