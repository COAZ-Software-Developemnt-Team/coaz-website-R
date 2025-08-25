// Footer.js
import React from "react";
import { Logo } from "./CoazIcons";
import { MdEmail } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebook } from "react-icons/fa6";
import { GiMailbox } from "react-icons/gi";
import { FaLocationDot, FaClock } from "react-icons/fa6";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[rgb(0,175,240)] text-white">
      {/* Main footer content */}
      <div className="px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-50 h-50 bg-white rounded-full mb-4 flex items-center justify-center font-bold text-black">
              <Logo fill="rgb(0,175,240)" />
            </div>
            <p className="text-center md:text-left"></p>
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
                <FaClock /> Weekends: 08:00 - 12:00
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="bg-[rgba(0,0,0,0.2)] py-4">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-center md:text-left">
              Copyright All Right Reserved 2024, Coaz
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
