import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Room from './pages/Room'
import CanvasPage from './pages/CanvasPage'
function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/room' element={<Room/>} />
      <Route path='/canvas' element={<CanvasPage/>}/>
    </Routes>
    </>
  )
}

export default App
