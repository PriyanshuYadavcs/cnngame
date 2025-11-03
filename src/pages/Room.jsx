import React from "react";
import { useState } from "react";
import ExtrudedIcon from "../components/ExtrudedIcon";
import { Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExtrudedIconForText from "../components/ExtrudedIconForText";
import { Link } from "react-router-dom";
const Room = () => {
  const red = "#e53e3e";
  const blue = "#4299e1";
  const green = "#48bb78";
  const yellow = "#f6e05e";

  const [chose, setSelected] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate= useNavigate(); 

  const handleJoin=()=>{
    if(!playerName || !roomId){
      alert("Please enter both your name and room code before joining;");
      return; 
    }
    navigate(`/canvas?roomId=${roomId}&playerName=${playerName}`);

  };
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-plus-pattern ">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold ">Doodlr</h1>
          <p className="mt-2">Choose your avatar and enter the arena.</p>
        </div>
        {/*avatar selection */}

        <div className="flex p-4 justify-center items-center space-x-3 sm:space-x-4 mb-8">
          <div
            className={`avatar  ${chose == "red" ? "selected" : ""} `}
            onClick={() => setSelected("red")}
            style={{ backgroundColor: red }}
          ></div>
          <div
            className={`avatar ${chose == "blue" ? "selected" : ""}`}
            onClick={() => setSelected("blue")}
            style={{ backgroundColor: blue }}
          ></div>
          <div
            className={`avatar ${chose == "green" ? "selected" : ""}`}
            onClick={() => setSelected("green")}
            style={{ backgroundColor: green }}
          ></div>
          <div
            className={`avatar ${chose == "yellow" ? "selected" : ""}`}
            onClick={() => setSelected("yellow")}
            style={{ backgroundColor: yellow }}
          ></div>
        </div>

        <div className="flex flex-col sm:flex-row mb-6 gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full sm:flex-grow h-10 px-3 border rounded"
          />
          <select
            className="w-full sm:w-48 h-10 px-3 border rounded"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        <div className="flex justify-between items-center mb-6 ">
          <input
            type="text"
            placeholder="Enter room code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mr-4 flex-1 h-10 px-3 border rounded"
          />
          <div onClick={handleJoin} className="cursor-pointer">
              <ExtrudedIconForText
            text={"Join Room"}
            bgColor={"bg-[#1877F2] "}
            darkerBgColor={"bg-[#145DBF]"}
            size={40}
            widthSize={120}
            depth={4}
          />
          </div>
          
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-blue-500"></div>
          <span className="flex-shrink mx-4 text-blue-300 text-sm">
            OR PRIVATE ROOM
          </span>
          <div className="flex-grow border-t border-blue-500"></div>
        </div>
        <div className="w-full max-w-md">
         <div className="w-full max-w-md">
          <div onClick={handleJoin} className="cursor-pointer">
            <ExtrudedIconForText
              text={"Join Room"}
              bgColor={"bg-[#1877F2] "}
              darkerBgColor={"bg-[#145DBF]"}
              size={40}
              widthSize={380}
              depth={4}
            />
          </div>
        </div>

        </div>
      </div>
    </main>
  );
};

export default Room;
