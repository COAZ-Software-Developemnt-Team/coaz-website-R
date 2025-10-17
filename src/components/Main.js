import React from "react";
import {Outlet} from "react-router-dom";
import Menu from "./Menu";
import {Logo} from "./CoazIcons";
import Sidebar from "./Sidebar";

import {FaClock, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,} from "react-icons/fa";
import {FaFacebook, FaLocationDot} from "react-icons/fa6";
import {IoLogoWhatsapp} from "react-icons/io";
import {MdEmail} from "react-icons/md";
import {GiMailbox} from "react-icons/gi";

const Main = () => {
    return (
        <div className="w-full h-auto">
        <Sidebar/>
            <header className="h-fit">
                <Menu/>
            </header>
            <Outlet/>
            <footer className="bg-[rgb(0,175,240)] text-white">
                {/* Main footer content */}
                <div className="px-8 py-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center md:items-start">
                            <div
                                className="w-50 h-50 bg-white rounded-full mb-4 flex items-center justify-center font-bold text-black">
                                {<Logo fill="rgb(0,175,240)"/>}
                            </div>
                            <p className="text-center md:text-left"></p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">CONTACT US</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <MdEmail/> info@coaz.com
                                </li>
                                <li className="flex items-center gap-2">
                                    <IoLogoWhatsapp/> +260761234390
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaFacebook />
                                    <a
                                        href="https://www.facebook.com/COAZAmbia"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-1 hover:underline"
                                    >
                                        Clinical Officers Association Of Zambia
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <GiMailbox/> P.O Box 12345
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">LOCATION</h3>
                            <li className="flex items-center gap-2">
                                <FaLocationDot />
                                <a
                                    href="https://maps.app.goo.gl/97wDsLG7mr49muAY9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    Kapwayambale Rd, Obama
                                </a>
                            </li>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">WORK HOURS</h3>
                            <ul>
                                <li className="flex items-center gap-2">
                                    <FaClock/> Week Days: 08:00 - 17:00
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright section - this is what you need to add */}
                <div className="bg-[rgba(0,0,0,0.2)] py-4">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-center md:text-left">
                                Copyright All Right Reserved 2024, Coaz
                            </p>
                            <div className="flex space-x-4 mt-2 md:mt-0">
                                <a href="#" className="hover:text-gray-200 transition-colors">
                                    <FaFacebookF size={16}/>
                                </a>
                                <a href="#" className="hover:text-gray-200 transition-colors">
                                    <FaTwitter size={16}/>
                                </a>
                                <a href="#" className="hover:text-gray-200 transition-colors">
                                    <FaInstagram size={16}/>
                                </a>
                                <a href="#" className="hover:text-gray-200 transition-colors">
                                    <FaLinkedinIn size={16}/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Main;