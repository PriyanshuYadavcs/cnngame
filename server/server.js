// server.js

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js";
import Room from "./models/Room.js";
import { startRound, submitDrawing, finishRound } from "./controllers/roundController.js";
import { loadModel, evaluateDrawing } from "./controllers/aiController.js";
import getRandomWord from "./utils/getRandomWord.js";

dotenv.config();
connectDB();

loadModel();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/model", express.static(path.join(__dirname, "./model")));

const roundTimers = {};

// SOCKET CONNECTIONS
io.on("connection", (socket) => {
  console.log("[SERVER] socket connected:", socket.id);

  // Player joins a room
  socket.on("join_room", async ({ roomId, userName }) => {
    try {
      console.log(`[SERVER] ${userName} trying to join ${roomId}`);

      let room = await Room.findOne({ roomId });

      // Create room if it doesn’t exist
      if (!room) {
        room = new Room({
          roomId,
          players: [{ userName, socketId: socket.id }],
          isRoundActive: false,
        });
        await room.save();
        socket.join(roomId);
        io.to(roomId).emit("room_update", room.players);
        console.log(`[SERVER] Created new room ${roomId} with ${userName}`);
        return;
      }

      // Join existing room
      socket.join(roomId);

      // Avoid duplicate entry
      if (!room.players.some((p) => p.socketId === socket.id)) {
        room.players.push({ userName, socketId: socket.id });
        await room.save();
      }

      io.to(roomId).emit("room_update", room.players);
      console.log(`[SERVER] ${userName} joined ${roomId} (${room.players.length} players)`);

      // Only start round when 2 players joined and no active round
      if (room.players.length === 2 && !room.isRoundActive) {
        room.isRoundActive = true;
        await room.save();

        const word = getRandomWord();
        const round = await startRound(roomId, word);

        console.log(`[SERVER] Starting new round in ${roomId} with word: ${word}`);

        io.to(roomId).emit("pre_round", { word, delay: 5 });

        // Start the round after 5s delay (no evaluation logic here)
        setTimeout(() => {
          io.to(roomId).emit("start_round", { word, timer: 15 });
        }, 5000);
      }
    } catch (err) {
      console.error(`[SERVER] join_room error: ${err.message}`);
    }
  });

  // Drawing broadcast
  socket.on("drawing", ({ roomId, x0, y0, x1, y1, color }) => {
    socket.to(roomId).emit("drawing", { x0, y0, x1, y1, color });
  });

  //  Handle drawing submission
  socket.on("submit_drawing", async ({ roomId, imageData }) => {
    try {
      console.log(`[SERVER] Drawing received from ${socket.id} in ${roomId}`);

      const round = await submitDrawing(roomId, socket.id, imageData);

      if (!round) {
        console.warn(`[SERVER] No active round found for ${roomId}, ignoring submission`);
        return;
      }

      // If both players submitted evaluate and finish
      if (round.drawings.length >= 2) {
        console.log(`[SERVER] Both players submitted in ${roomId}, evaluating...`);

        const {results, winner} = await evaluateDrawing(round.word, round.drawings);
        const finishedRound = await finishRound(roomId, results, winner);

        io.to(roomId).emit("round_result", finishedRound);
        console.log("[SERVER] Round result object:", finishedRound);


        const room = await Room.findOne({ roomId });
        room.isRoundActive = false;
        await room.save();

        console.log(`[SERVER] Round finished successfully for ${roomId}`);
      }
    } catch (err) {
      console.error(`[SERVER] Error in submit_drawing for ${roomId}: ${err.message}`);
      socket.emit("submission_error", "Could not submit drawing. Try again.");
    }
  });

  // Disconnect handling
  socket.on("disconnect", async () => {
    console.log("[SERVER] socket disconnected:", socket.id);

    const room = await Room.findOne({ "players.socketId": socket.id });
    if (room) {
      room.players = room.players.filter((p) => p.socketId !== socket.id);
      await room.save();

      io.to(room.roomId).emit("room_update", room.players);

      // Delete empty room
      if (room.players.length === 0) {
        await Room.deleteOne({ roomId: room.roomId });
        console.log(`[SERVER] Deleted empty room ${room.roomId}`);
      }
    }
  });
});

server.listen(3001, () => console.log("[SERVER] Running on port 3001"));
