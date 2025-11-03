import React from 'react';
import ExtrudedIcon from './ExtrudedIcon';
import { CircleHelp } from "lucide-react";
import { useState } from 'react';
import { Twitter , Facebook} from 'lucide-react';
import SlidingPage from '../pages/SlidingPage';

const NavBar = () => {
    const shareURL = "https://x.com/intent/post?text=Check%20out%20this%20cool%20drawing%20game!&url=https%3A%2F%2Fyour-game-link.com";
    const [isPageOpen, setPageOpen ]= useState(false); 
    return (
        <div className='flex flex-row justify-between align-center p-4'>
            <div onClick={()=>setPageOpen(true)}>
                <ExtrudedIcon
                icon={<CircleHelp/>}
                bgColor={"bg-red-500"}
                darkerBgColor={"bg-red-700"}
                size={40}
                widthSize={40}
                depth={4}
                />

               
            </div>



            <div className='flex flex-row gap-x-4'>
    <a href={shareURL} target="_blank" rel="noopener noreferrer" className='w-[40px] h-[40px]'>
                <ExtrudedIcon
                icon={<Twitter/>}
                bgColor={"bg-[#1DA1F2] "}
                darkerBgColor={"bg-[#157DC1]"}
                size={40}
                widthSize={40}
                depth={4}
                />
    </a>
    <a href={shareURL} target="_blank" rel="noopener noreferrer" className='w-[40px] h-[40px]'>
                <ExtrudedIcon
                icon={<Facebook/>}
                bgColor={"bg-[#1877F2] "}
                darkerBgColor={"bg-[#145DBF]"}
                size={40}
                widthSize={40}
                depth={4}
                />
</a>
            </div>
             <SlidingPage
                isOpen= {isPageOpen}
                onClose={()=>setPageOpen(false)}
                />

        </div>
    );
}

export default NavBar;