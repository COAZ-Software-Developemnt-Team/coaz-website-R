import React from 'react';
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { GiTargetArrows } from "react-icons/gi";
import { FaRegEye } from "react-icons/fa";
import { LuHeartHandshake } from "react-icons/lu";

const Objective = () => {
  return (
    <div className="flex flex-col w-full min-h-screen px-[10%] py-12 bg-white">
      {/* Heading */}
      <p
        style={{ fontSize: "42px", lineHeight: "52px" }}
        className="flex w-full h-auto mt-8 text-[rgb(50,50,50)] font-leBeauneNew"
      >
        Objectives of the Association
      </p>

      {/* Intro text */}
      <p className="text-[rgb(85,85,85)] text-lg font-jostSemi mt-6 w-full">
        The objectives of the Association will include, but are not limited to,
        the following:
      </p>

      {/* Bullet objectives */}
      <div className="flex flex-col space-y-4 mt-6 w-full">
        <div className="flex flex-row space-x-4">
          <GoDotFill
            size={16}
            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
          />
          <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
            To regulate and promote the training, ethics, and practice of
            Clinical Officers in Zambia.
          </p>
        </div>

        <div className="flex flex-row space-x-4">
          <GoDotFill
            size={16}
            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
          />
          <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
            To safeguard the dignity and rights of Clinical Officers.
          </p>
        </div>

        <div className="flex flex-row space-x-4">
          <GoDotFill
            size={16}
            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
          />
          <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
            To collaborate with the Ministry of Health and other health-related
            bodies in improving healthcare delivery.
          </p>
        </div>

        <div className="flex flex-row space-x-4">
          <GoDotFill
            size={16}
            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
          />
          <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
            To perform other functions incidental to the attainment of these
            objectives.
          </p>
        </div>
      </div>

     

      {/* Centered Back Link */}
      <div className="flex justify-center mt-8">
        <Link
          to="/about"
          className="text-blue-600 font-jostSemi underline hover:text-blue-800 transition"
        >
          Back to About
        </Link>
      </div>
    </div>
  );
};

export default Objective;
