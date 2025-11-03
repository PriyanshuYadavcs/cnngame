import Room from "../models/Room.js";

export async function createOrJoinRoom(roomId, userName, socketId) {
  let room = await Room.findOne({ roomId });

  if (!room) {
    // Create a new room
    room = new Room({
      roomId,
      players: [{ userName, socketId }],
    });
    await room.save();
    return room;
  }

  // Add player if not already present
  if (!room.players.some((p) => p.socketId === socketId)) {
    room.players.push({ userName, socketId });
    await room.save();
  }

  return room;
}

export async function removePlayer(socketId) {
  const room = await Room.findOne({ "players.socketId": socketId });
  if (!room) return null;

  room.players = room.players.filter((p) => p.socketId !== socketId);
  await room.save();

  // Delete room if empty
  if (room.players.length === 0) {
    await Room.deleteOne({ roomId: room.roomId });
  }

  return room;
}
