import React, { useRef, useState, useEffect } from "react";
import Header from "../components/Header";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";

const CanvasPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const userName = searchParams.get("playerName");

  const [timeLeft, setTimeLeft] = useState(5);
  const [socket, setSocket] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showReadyMessage, setShowReadyMessage] = useState(false);
  const [drawingPrompt, setDrawingPrompt] = useState("");

  const localCanvasRef = useRef(null);
  const localContextRef = useRef(null);
  const remoteCanvasRef = useRef(null);
  const remoteContextRef = useRef(null);

  //   socket connection 
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    //  handlers 
    const handleConnect = () => {
      console.log("[CLIENT] Connected:", newSocket.id);
      newSocket.emit("join_room", { roomId, userName });
    };

    const handleRoomUpdate = (players) => {
      console.log("Room players:", players);
    };

    const handlePreRound = ({ word, delay }) => {
      console.log("Pre-round started. word:", word);
      setShowReadyMessage(true);
      setDrawingPrompt("");
      setTimerStarted(false);
      setTimeLeft(delay);
      setSubmitted(false);
    };

    const handleStartRound = ({ word, timer }) => {
      console.log("Round starting with word:", word);
      setShowReadyMessage(false);
      setDrawingPrompt(word);
      setTimeLeft(timer);
      setTimerStarted(true);
    };

    const handleDrawing = ({ x0, y0, x1, y1, color }) => {
      const remoteContext = remoteContextRef.current;
      if (!remoteContext) return;
      remoteContext.beginPath();
      remoteContext.moveTo(x0, y0);
      remoteContext.lineTo(x1, y1);
      remoteContext.strokeStyle = color;
      remoteContext.stroke();
      remoteContext.closePath();
    };

    const handleRoundResult = (data) => {
      console.log("Round result:", data);
      alert("Round over!");
    };

    // Attach listeners
    newSocket.on("connect", handleConnect);
    newSocket.on("room_update", handleRoomUpdate);
    newSocket.on("pre_round", handlePreRound);
    newSocket.on("start_round", handleStartRound);
    newSocket.on("drawing", handleDrawing);
    newSocket.on("round_result", handleRoundResult);

    //  Cleanup
    return () => {
      console.log("Disconnecting socket...");
      newSocket.off("connect", handleConnect);
      newSocket.off("room_update", handleRoomUpdate);
      newSocket.off("pre_round", handlePreRound);
      newSocket.off("start_round", handleStartRound);
      newSocket.off("drawing", handleDrawing);
      newSocket.off("round_result", handleRoundResult);
      newSocket.disconnect();
    };
  }, [roomId, userName]);

  // Timer countdown
  useEffect(() => {
    if (!timerStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted, timeLeft]);

  // Submit drawing when time ends
  useEffect(() => {
    if (!timerStarted || submitted || timeLeft > 0) return;

    const canvas = localCanvasRef.current;
    if (!canvas || !socket) return;

    const imageData = canvas.toDataURL("image/png");
    console.log("Submitting drawing...");
    socket.emit("submit_drawing", { roomId, imageData });
    setSubmitted(true);
  }, [timeLeft, timerStarted, submitted, socket, roomId]);

  // Setup canvases
  useEffect(() => {
    const localCanvas = localCanvasRef.current;
    const remoteCanvas = remoteCanvasRef.current;

    localCanvas.width = 700;
    localCanvas.height = 500;
    remoteCanvas.width = 700;
    remoteCanvas.height = 500;

    const localContext = localCanvas.getContext("2d");
    localContext.lineCap = "round";
    localContext.strokeStyle = "#3b82f6";
    localContext.lineWidth = 5;
    localContextRef.current = localContext;

    const remoteContext = remoteCanvas.getContext("2d");
    remoteContext.lineCap = "round";
    remoteContext.lineWidth = 5;
    remoteContextRef.current = remoteContext;
  }, []);

  //  Drawing functions
  const startDrawing = ({ nativeEvent }) => {
    if (!timerStarted) return;
    const { offsetX, offsetY } = nativeEvent;
    localContextRef.current.beginPath();
    localContextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    localContextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY, movementX, movementY } = nativeEvent;
    const context = localContextRef.current;

    // draw locally
    context.lineTo(offsetX, offsetY);
    context.stroke();

    // send drawing to server
    if (socket) {
      socket.emit("drawing", {
        roomId,
        x0: offsetX - movementX,
        y0: offsetY - movementY,
        x1: offsetX,
        y1: offsetY,
        color: context.strokeStyle,
      });
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white shadow">
        <Header
          timeLeft={timeLeft}
          drawingPrompt={drawingPrompt || "Waiting..."}
        />
      </div>

      <div className="flex flex-col items-center mt-10 text-center">
        {showReadyMessage && (
          <div className="text-xl font-semibold text-blue-600 animate-pulse">
            Opponent joined! Get ready... starting soon
          </div>
        )}

        {drawingPrompt && timerStarted && (
          <div className="text-2xl font-bold mt-4 text-green-700">
            Prompt: {drawingPrompt}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-evenly items-center">
        <div className="text-center p-2">
          <h2 className="font-bold">DRAW HERE!</h2>
          <canvas
            ref={localCanvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            className="bg-white max-w-full rounded-lg shadow-lg border-2 border-blue-300 cursor-crosshair"
          />
        </div>

        <div className="text-center p-2">
          <h2 className="font-bold">Opponent's Canvas</h2>
          <canvas
            ref={remoteCanvasRef}
            className="bg-white max-w-full rounded-lg shadow-lg border-2 border-blue-300"
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
