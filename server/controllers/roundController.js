import Room from "../models/Room.js";
import Round from "../models/Round.js";

export async function startRound(roomId, word) {
  try {
    const round = new Round({
      roomId,
      word,
      drawings: [],
    });

    await round.save();

    // update room’s currentRound reference
    await Room.findOneAndUpdate(
      { roomId },
      { currentRound: round._id },
      { new: true }
    );

    console.log(`[CONTROLLER] New round started for ${roomId}`);
    return round;
  } catch (err) {
    console.error(`[CONTROLLER] startRound failed for ${roomId}: ${err.message}`);
    return null;
  }
}

export async function submitDrawing(roomId, socketId, imageData) {
  try {
    const room = await Room.findOne({ roomId }).populate("currentRound");
    if (!room || !room.currentRound) {
      console.warn(`[CONTROLLER] No active round found for ${roomId}`);
      return null; // instead of crashing
    }

    const round = await Round.findById(room.currentRound._id);
    if (!round) {
      console.warn(`[CONTROLLER] Round doc missing for ${roomId}`);
      return null;
    }

    // Add drawing only if this player hasn't submitted yet
    if (!round.drawings.some((d) => d.playerId === socketId)) {
      round.drawings.push({ playerId: socketId, imageData });
      await round.save();
      console.log(`[CONTROLLER] Drawing saved from ${socketId} in ${roomId}`);
    } else {
      console.log(`[CONTROLLER] Duplicate submission ignored from ${socketId}`);
    }

    return round;
  } catch (err) {
    console.error(`[CONTROLLER] submitDrawing failed for ${roomId}: ${err.message}`);
    return null;
  }
}

export async function finishRound(roomId, results) {
  try {
    const room = await Room.findOne({ roomId }).populate("currentRound");
    if (!room || !room.currentRound) {
      console.warn(`[CONTROLLER] No active round to finish in ${roomId}`);
      return null;
    }

    const round = await Round.findById(room.currentRound._id);
    if (!round) {
      console.warn(`[CONTROLLER] Round doc missing for ${roomId}`);
      return null;
    }

    // Store results + winner
    round.results = results;
    round.winner = results.winner;
    await round.save();

    // clear currentRound from room
    room.currentRound = null;
    await room.save();

    console.log(`[CONTROLLER] Round finished for ${roomId}`);
    return round;
  } catch (err) {
    console.error(`[CONTROLLER] finishRound failed for ${roomId}: ${err.message}`);
    return null;
  }
}
