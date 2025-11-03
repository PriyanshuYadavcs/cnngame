import React, { useState } from 'react';

const ExtrudedIconForText = ({ text, bgColor, darkerBgColor, size,widthSize, depth }) => {
    const [isPressed, setIsPressed] = useState(false);

    const mainFaceStyle = {
        width: `${widthSize}px`,
        height: `${size}px`,
        transition: 'transform 0.1s ease-out',
        transform: isPressed ? `translate(${depth}px, ${depth}px)` : 'translate(0,0)',
        cursor: 'pointer'
    };

    const extrusionStyle = {
        width: `${widthSize}px`,
        height: `${size}px`,
        transform: `translate(${depth}px, ${depth}px)`
    };

    return (
        <div className="relative" style={{ width: `${widthSize}px`, height: `${size}px` }}>
            {/* This is the darker extruded part */}
            <div
                className={`absolute top-0 left-0 rounded-lg ${darkerBgColor}`}
                style={extrusionStyle}
            >
            </div>
            {/* This is the main visible part */}
            <div
                className={`relative flex items-center justify-center rounded-lg ${bgColor=="bg-white"? "text-black":"text-white"} ${bgColor}`}
                style={mainFaceStyle}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
            >
               {text}
            </div>
        </div>
    );
}

export default ExtrudedIconForText;