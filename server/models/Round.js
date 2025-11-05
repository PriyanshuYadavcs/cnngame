import mongoose from "mongoose";

const drawingSchema = new mongoose.Schema({
  playerId: String, // socketId or userName
  imageData: String, // Base64 or file URL
});

const resultSchema = new mongoose.Schema({
  playerId: String,
  topPrediction: String,
  topConfidence: Number,
  top10: [
    {
      label: String,
      confidence: Number,
    }
  ],
});

const roundSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  word: { type: String, required: true },
  drawings: [drawingSchema],
  result:[resultSchema],
  winner: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Round = mongoose.model("Round", roundSchema);
export default Round;
