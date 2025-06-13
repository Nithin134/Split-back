import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, enum: ["Food", "Wi-Fi", "Rent", "Electricity", "Other"], default: "Other" },
  amount: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Expense", expenseSchema);
