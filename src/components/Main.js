import React from 'react'
import { useNavigate,Outlet } from 'react-router-dom'
import Menu from './Menu'
import {Logo} from "./CoazIcons";
import {BsClockFill, BsEnvelopeFill, BsFillTelephoneFill} from "react-icons/bs";
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaPaperPlane} from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { GiMailbox } from "react-icons/gi";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";

const Main = () => {

  return (
    <div className='w-full h-auto'>
        <header className="h-fit">
            <Menu/>
        </header>
        <Outlet/>
        <footer className="px-8 py-10 bg-[rgb(0,175,240)]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">


                <div className="flex flex-col items-center md:items-start">
                    <div className="w-50 h-50 bg-white rounded-full mb-4 flex items-center justify-center font-bold text-black">
                        {<Logo fill="rgb(0,175,240)"/>}
                    </div>
                    <p className="text-center md:text-left">
                    </p>
                </div>


                <div>
                    <h3 className="font-semibold mb-4">CONTACT US</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <MdEmail /> info@coaz.com
                        </li>
                        <li className="flex items-center gap-2">
                            <IoLogoWhatsapp /> +260761234390
                        </li>
                        <li className="flex items-center gap-2">
                            <FaFacebook /> Clinical Officers Association Of Zambia
                        </li>
                        <li className="flex items-center gap-2">
                            <GiMailbox /> P.O Box 12345
                        </li>
                    </ul>
                </div>


                <div>
                    <h3 className="font-semibold mb-4">LOCATION</h3>

                    <li className="flex items-center gap-2">
                        <FaLocationDot /> Kapwayambale Rd, Obama
                    </li>


                </div>



                <div>
                    <h3 className="font-semibold mb-4">WORK HOURS</h3>

                    <ul>
                        <li className="flex items-center gap-2">
                            <FaClock /> Week Days: 08:00 - 17:00
                        </li>

                        <li className="flex items-center gap-2">
                            <FaClock /> Weekends:  08:00 - 12:00
                        </li>
                    </ul>
                </div>

            </div>

        </footer>
    </div>
  )
}

export default Main