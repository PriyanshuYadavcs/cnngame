import React, { useState } from 'react';

const ExtrudedIcon = ({ icon, bgColor, darkerBgColor, size, depth }) => {
    const [isPressed, setIsPressed] = useState(false);

    const mainFaceStyle = {
        width: `${size}px`,
        height: `${size}px`,
        transition: 'transform 0.1s ease-out',
        transform: isPressed ? `translate(${depth}px, ${depth}px)` : 'translate(0,0)',
        cursor: 'pointer' // ADDED: Show a pointer on hover
    };

    const extrusionStyle = {
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${depth}px, ${depth}px)`
    };

    return (
        <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
            {/* This is the darker extruded part */}
            <div
                className={`absolute top-0 left-0 rounded-lg ${darkerBgColor}`}
                style={extrusionStyle}
            >
            </div>
            {/* This is the main visible part */}
            <div
                className={`relative flex items-center justify-center rounded-lg text-white ${bgColor}`}
                style={mainFaceStyle}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
            >
                {icon}
            </div>
        </div>
    );
}

export default ExtrudedIcon;