import React, { useState } from 'react'
import ExtrudedIcon from './ExtrudedIcon';
import { Twitter } from 'lucide-react';

const Header = ({ timeLeft, drawingPrompt }) => {
  const [roomId, setRoomId] = useState("123");

  const formatTime = () => {
    if (timeLeft <= 0) return "Time's Up";
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <header className="
      bg-yellow-300 text-gray-900 shadow-lg w-full 
      flex flex-col md:flex-row justify-between items-center 
      px-4 py-3 gap-4 md:gap-0
    ">
      {/* Left */}
      <div className="flex-shrink-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center md:text-left">
          Draw: {drawingPrompt}
        </h2>
      </div>

      {/* Center */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div className="bg-white text-gray-900 px-3 py-1 sm:px-4 sm:py-2 rounded-lg border-2 border-gray-800 shadow-inner text-base sm:text-lg md:text-xl">
          {formatTime()}
        </div>
        <div className="text-gray-800 text-lg sm:text-xl md:text-2xl font-medium">
          Room Id: <span className="font-bold">{roomId}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex gap-2">
        {[1, 2, 3].map((_, i) => (
          <ExtrudedIcon
            key={i}
            icon={<Twitter />}
            bgColor={"bg-[#1DA1F2]"}
            darkerBgColor={"bg-[#157DC1]"}
            size={32}        // smaller for mobile
            widthSize={32}
            depth={4}
            className="sm:size-36 md:size-40"
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
