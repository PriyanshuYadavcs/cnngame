import React from 'react'
import NavBar from '../components/NavBar'
import ExtrudedIcon from '../components/ExtrudedIcon'
import { CircleHelp } from 'lucide-react'
import logo from "../assets/logo.png"
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import CanvasPage from './CanvasPage'
const Home = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <NavBar/>
        <div className='flex flex-col flex-grow items-center text-center px-4 py-8'>
            <div className='mb-8'>
                <img src={logo} alt='quickDrawimage' className='w-1/2 md:w-1/3 mx-auto'></img>
            </div>
            <div className='mb-4'>
                <h1 className='text-2xl md:text-4xl font-semibold text-gray-800 caveat-font'>Can a neural network learn to recognize doodling?</h1>
            </div>
            <div className='max-w-xl mb-8'>
                <p className='text-base md:text-[25px] '>Help teach it by adding your drawings to the world’s largest doodling data set, shared publicly to help with machine learning research.</p>
                
            </div>

            <div className=''>
                <Link to='/room'>
                <ExtrudedIcon
                icon={<CircleHelp/>}
                bgColor={"bg-[#FFC300]"}
                darkerBgColor={"bg-[#FFA500]"}
                size={50}
                widthSize={200}
                depth={4}
                />
                </Link>
            </div>

        </div>

        <Footer/>

    </div>
  )
}

export default Home