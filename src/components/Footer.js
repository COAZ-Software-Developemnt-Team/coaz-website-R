import React from 'react'
import {Logo} from '../CoazIcons';
import { BsEnvelopeFill,BsFillTelephoneFill } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaPaperPlane,FaFacebookF,FaLinkedinIn,FaInstagram } from "react-icons/fa";
import { FaLocationDot,FaXTwitter } from "react-icons/fa6";
import { BsClockFill } from "react-icons/bs";

const Footer = () => {
  return (
    <div className='relative flex flex-col shrink-0 w-full h-auto bg-white'>
      <div className='flex flex-col space-y-12 lg:flex-row px-[5%] items-center justify-between w-full h-auto py-8 lg:py-0 lg:h-80 bg-[rgba(0,175,240,.5)]'>
          <Logo size={128} fill='rgba(255,255,255,.8)'/>
          <div className='flex flex-col space-y-4 w-full lg:w-[20%] h-auto lg:h-[60%]'>
            <div className='flex flex-col w-auto space-y-4'>
                <p className='text-white text-lg font-leBeauneNew font-semibold'>Contacts</p>
                <div className='flex flex-row space-x-4 text-[rgba(255,255,255,.8)]'>
                  <BsEnvelopeFill size={16} className='my-auto'/>
                  <p className='my-auto text-sm tracking-wider font-jostBook'>coaz@info.com</p>
                </div>
                <div className='flex flex-row space-x-4 text-[rgba(255,255,255,.8)]'>
                  <BsFillTelephoneFill size={16} className='my-auto'/>
                  <p className='my-auto text-sm tracking-wider font-jostBook'>+260761234390</p>
                </div>
                <div className='flex flex-row space-x-4 text-[rgba(255,255,255,.8)]'>
                  <IoLogoWhatsapp size={16} className='my-auto'/>
                  <p className='my-auto text-sm tracking-wider font-jostBook'>+260761234390</p>
                </div>
                <div className='flex flex-row space-x-4 text-[rgba(255,255,255,.8)]'>
                  <FaPaperPlane size={16} className='my-auto'/>
                  <p className='my-auto text-sm tracking-wider font-jostBook'>P.O Box 12345</p>
                </div>
            </div>
          </div>
          <div className='flex flex-col space-y-4 w-full lg:w-[20%] h-auto lg:h-[60%]'>
            <div className='flex flex-col w-auto space-y-4'>
              <p className='text-white text-lg font-leBeauneNew font-semibold'>Locations</p>
              <div className='flex flex-row space-x-4 text-[rgba(255,255,255,.8)]'>
                <FaLocationDot size={16} className='my-auto shrink-0'/>
                <p className='my-auto text-sm tracking-wider font-jostBook'>House No. 22(01) MKP, Wezi Kaunda Road,PHI, Lusaka, Zambia</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col space-y-4 w-full lg:w-[20%] h-auto lg:h-[60%]'>
            <p className='text-white text-lg font-leBeauneNew font-semibold'>Work Hours</p>
            <div className='flex flex-row space-x-4 text-[rgba(255,255,255,.8)]'>
              <BsClockFill size={16} className='my-auto shrink-0'/>
              <p className='my-auto  text-sm tracking-wider font-jostBook'>Week days:  08:00 - 17:00</p>
            </div>
            <div className='flex flex-row space-x-4 text-[rgba(255,255,255,.8)]'>
              <BsClockFill size={16} className='my-auto shrink-0'/>
              <p className='my-auto text-sm tracking-wider font-jostBook'>Weekends:  08:00 - 12:00</p>
            </div>
          </div>
      </div>
      <div className='flex flex-col lg:flex-row justify-between w-full h-auto lg:h-16 px-[5%] py-4 lg:py-0 text-sm text-white tracking-wider font-jostLight bg-[rgb(0,175,240)]'>
          <p className='lg:my-auto mb-4 lg:mb-auto text-center lg:text-left'>Copyright All Right Reserved 2024, Coaz</p>
          {/* <p className='lg:my-auto mb-4 lg:mb-auto text-center lg:text-left'>Designed by Stometech Solutions</p> */}
          <div className='flex flex-row justify-center lg:justify-normal space-x-8 text-white'>
            <FaFacebookF size={20} className='my-auto cursor-pointer'/>
            <FaLinkedinIn size={20} className='my-auto cursor-pointer'/>
            <FaXTwitter size={20} className='my-auto cursor-pointer'/>
            <FaInstagram size={20} className='my-auto cursor-pointer'/>
          </div>
      </div>
    </div>
  )
}

export default Footer