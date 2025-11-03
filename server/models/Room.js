import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  userName: String,
  socketId: String,
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [playerSchema],
  currentRound: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Round",
    default: null,
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
