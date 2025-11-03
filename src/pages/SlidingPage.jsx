import React from 'react'
import ExtrudedIcon from '../components/ExtrudedIcon'
import { CircleHelp } from 'lucide-react'
import { X } from 'lucide-react'
const SlidingPage = ({isOpen, onClose}) => {
  return (
    <div className={`flex justify-end fixed inset-0 bg-red-500 z-50 transition-transform duration-500 ease-in-out
    ${isOpen? 'translate-y-0' : '-translate-y-full'}`}>
        <div onClick={onClose} className='p-4'>
                <ExtrudedIcon
                icon={<X/>}
                bgColor={"bg-white"}
                darkerBgColor={"bg-gray-500"}
                size={40}
                widthSize={40}
                depth={4}
                className="text-black"
                />
            </div>
    </div>
  )
}

export default SlidingPage