// Page.js
import React, {useContext} from 'react'
import {IoIosArrowForward} from 'react-icons/io';
import {useLocation, useParams} from 'react-router-dom'
import {UserContext} from "../contexts/UserContext";

const Page = ({children}) => {
    const {duty} = useParams(); 
    const path = useLocation().pathname;
    const pathItems = path?path.split('/'):[];
    const { mode } = useContext(UserContext);


    return (
    <div className='flex flex-col w-full h-auto min-h-screen'>
        {/* Hero Section */}
        <div className='relative flex flex-col w-full h-72 justify-center items-center space-y-4 bg-[url(/public/images/img_26.jpg)] bg-cover bg-center'>
            <div style={{background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)',opacity: '.8'}} className="absolute left-0 top-0 w-full h-full"/>
            <p className='z-0 text-center text-[40px] font-nunitoSansBlack text-white capitalize'>{duty?duty.replace(/_/g,' '):''}</p>
            <div className='flex flex-wrap w-fit h-auto items-center justify-center z-0 font-nunitoSansRegular text-white uppercase'>
                <span className='flex flex-row items-center text-[13px] tracking-wider'>home</span>
                {pathItems && pathItems.map((item,i) => 
                    {
                        if(item === '/' || item.trim().length === 0) return;
                        return <div key={i} className='flex flex-row items-center text-[13px] tracking-wider space-x-3'><IoIosArrowForward size={13}/><span>{item.replace(/_/g,' ')}</span></div>
                    }) 
                }
            </div>
        </div>

        {/* Content Section */}
        <div className='w-full bg-white flex-1'>
            {children}

        </div>
    </div>
  )
}

export default Page;
