import React from 'react'
import { useNavigate,Outlet } from 'react-router-dom'
import Menu from './Menu'

const Main = () => {

  return (
    <div className='w-full h-auto'>
        <header className="h-fit">
            <Menu/>
        </header>
        <Outlet/>
        <div className="flex w-full h-[640px] px-8 py-10 bg-[rgb(35,35,35)] shrink-0">
        </div>
    </div>
  )
}

export default Main