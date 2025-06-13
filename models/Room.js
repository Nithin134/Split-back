import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notifiedAt: { type: Date }
});

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [participantSchema],
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("Room", roomSchema);
