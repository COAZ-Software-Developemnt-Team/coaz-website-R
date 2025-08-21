import React from 'react'
import {Outlet} from 'react-router-dom';

const Content = () => {

  return (
    <div className='relative flex w-full h-auto'>
        <Outlet/>
    </div>
  )
}

export default Content