import React, { useState, useEffect, useContext, useRef } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { TbTargetArrow } from "react-icons/tb";
import { FaListCheck } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { GiFlagObjective } from "react-icons/gi";
import { GiTargetArrows } from "react-icons/gi";
import { findPerson } from "../data";
import { LuHeartHandshake } from "react-icons/lu";
import Person from "./Person";
import { Link } from "react-router-dom";

const About = () => {
  const { mainElementRef } = useContext(GlobalContext);

  useEffect(() => {
    if (mainElementRef && mainElementRef.current) {
      mainElementRef.current.scrollTo({ top: 0 });
    }
  }, [mainElementRef]);

  return (
    <div className="relative flex flex-col w-full h-auto">
      {/* Banner */}
      <div className="relative flex flex-col w-full h-[60vh] shrink-0 overflow-x-hidden overflow-y-auto">
        <img
          src="/images/img_35.jpg"
          className="flex w-full h-full object-cover object-top overflow-hidden"
        />
        <div className="absolute flex left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.8)] via-transparent to-[rgba(0,0,0,.8)]" />
        <div className="absolute flex flex-col space-y-4 items-center justify-center top-[166px] bottom-0 w-full">
          <div className="flex w-px h-16 shrink-0 border-l border-white"></div>
          <p className="text-white tracking-wide whitespace-nowrap text-xl font-leBeauneNew">
            ABOUT
          </p>
          <p className=" text-white tracking-wide text-center text-7xl lg:text-9xl font-leBeauneNew">
            COAZ
          </p>
          <div className="flex w-px h-full mx-auto border-r border-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col w-full h-auto px-[10%] shrink-0 bg-white">
        <div className="flex w-[2px] h-20 mx-auto border-r border-[rgb(204,204,204)]"></div>
        <p className="flex w-auto h-auto mx-auto mt-8 text-md text-[rgb(150,150,150)] font-leBeauneNew">
          about us
        </p>
        <p
          style={{ fontSize: "42px", lineHeight: "52px" }}
          className="flex w-[90%] lg:w-[600px] h-auto mt-8 mx-auto text-center text-[rgb(50,50,50)] font-leBeauneNew"
        >
          Learn More About The Association
        </p>

        {/* Background */}
        <p
          style={{ fontSize: "30px", lineHeight: "52px" }}
          className="flex w-[90%] lg:w-[600px] h-auto mt-8 text-left text-[rgb(50,50,50)] font-leBeauneNew"
        >
          Back Ground
        </p>

        <div className="flex flex-col w-full h-auto space-y-8 pb-16">
          <div className="flex flex-col space-y-4 w-full h-auto">
            <p className="text-lg mt-4 text-[rgb(85,85,85)] font-jostBook">
              Founded in 1967, the Clinical Officers Association of Zambia
              (COAZ) is the largest and only national association that convenes
              116+ District Branches and Sub-division Clinical Professional
              societies and other critical stakeholders. Throughout history, the
              COAZ has always followed its mission
            </p>
            <p className="text-[rgb(85,85,85)] text-lg font-jostBook">
              As the Clinicians’ powerful ally in Health care, the COAZ delivers
              on this mission by representing Clinical officers and clinical
              Practitioners with a unified voice in health and legislative
              bodies across the nation, removing obstacles that interfere with
              our practice, patient care, leading the charge to decentralized
              health care and confront public health crises, and driving the
              future to tackle the biggest challenges in health care and
              training the leaders of tomorrow
            </p>

            {/* Mission */}
            <p
              style={{ fontSize: "25px", lineHeight: "52px" }}
              className="flex w-[90%] lg:w-[600px] h-auto mt-6 text-left text-[rgb(50,50,50)] font-leBeauneNew"
            >
              Mission
            </p>
            <p className="text-[rgb(85,85,85)] text-lg font-jostBook">
              The mission of the Clinical Officers Association of Zambia is to
              unite, represent, and advance the professional interests,
              development, and welfare of Clinical Officers and mid-level
              clinical practitioners across the country.
            </p>

            {/* Aim */}
            <p
              style={{ fontSize: "25px", lineHeight: "52px" }}
              className="flex w-[90%] lg:w-[600px] h-auto mt-6 text-left text-[rgb(50,50,50)] font-leBeauneNew"
            >
              Aim
            </p>
            <p className="text-[rgb(85,85,85)] text-lg font-jostSemi">
              Our aim is to serve as the Voice and governing professional body for Clinical
              Officers and mid-level Clinical practioners, promoting their
              dignity, rights, training, regulatory compliance, and contribution
              to health and national development
            </p>

             {/* Aim */}
            <p
              style={{ fontSize: "25px", lineHeight: "52px" }}
              className="flex w-[90%] lg:w-[600px] h-auto mt-6 text-left text-[rgb(50,50,50)] font-leBeauneNew"
            >
             Vision
            </p>
            <p className="text-[rgb(85,85,85)] text-lg font-jostSemi">
              Our vision is to lead in enhancing the role and effectiveness of clinical officers in delivering quality healthcare services across Zambia
            </p>

            {/* Centered Read More Link */}
            <div className="flex justify-center mt-4">
              <Link
                to="/objective"
                className="text-blue-600 font-jostSemi underline hover:text-blue-800 transition"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default About;
