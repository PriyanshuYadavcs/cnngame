import React from 'react';

const Footer = () => {
  return (
    // On mobile: stack vertically (flex-col), center items, and add a gap.
    // On medium screens and up (md:): switch to a row and justify between.
    <footer className='flex flex-col md:flex-row md:justify-between items-center gap-4 p-4 text-gray-500 text-sm'>
      
      {/* Left side content */}
      {/* On mobile: stack vertically (flex-col) and center text. */}
      {/* On medium screens and up (md:): switch to a row with a horizontal gap. */}
      <div className='flex flex-col md:flex-row md:gap-x-8 text-center md:text-left'>
        <div>
          This is a Deep Learning Game.
        </div>
        <div>
          Made by a student from DTU.
        </div>
      </div>

      {/* Right side content */}
      <div>
        <a href="#" className="hover:underline">PRIVACY & TERMS</a>
      </div>
      
    </footer>
  );
}

export default Footer;