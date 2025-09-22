import React from 'react'
import { FaRegCircleDot } from "react-icons/fa6";
import Button from "./Button";

const DeliveringCare = () => {
  return (
    <div className='flex flex-col space-y-8 w-full h-auto'>
        <div className='flex flex-col w-full h-auto'>
            <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                COAZ is committed to involving members in shaping the COAZ Insurance Scheme. Members’ feedback will directly influence:
            </p>
        </div>
            <div className='flex flex-col space-y-8 w-full h-auto'>
            <div className='flex flex-row space-x-4'>
              <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
              <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>Coverage benefits and priority areas</p>
            </div>
            <div className='flex flex-row space-x-4'>
              <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
              <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>Premium rates and payment flexibility</p>
            </div>
            <div className='flex flex-row space-x-4'>
              <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
              <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>Inclusion of specialist services</p>
            </div>
        </div>
        <div className='flex flex-col space-y-4 w-full h-auto'>
            <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>Upcoming Member Consultations:</p>
            <div className='flex flex-row space-x-4'>
              <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
              <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>Opportunities to co-design a scheme that truly meets your needs.</p>
            </div>
            <div className='flex flex-row space-x-4'>
            <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                Virtual and in-person sessions to collect member preferences and suggestions.
            </p>
            </div>
            <div className='space-x-16'>
                <Button text="Join The Constitution" onClick={() => alert("Button clicked!")} />
                <Button text="Register For Updates" onClick={() => alert("Button clicked!")} />

            </div>
            <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>Our Commitment</p>
            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                COAZ believes no Clinical Officer should face financial hardship due to illness or accidents. Our dual approach ensures:
            </p>
            <div className='flex flex-row space-x-4'>
              <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
              <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>National Advocacy: Shaping policies to make insurance inclusive, fair, and transparent.</p>
            </div>
            <div className='flex flex-row space-x-4'>
              <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
              <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>Member Insurance Scheme: Directly providing affordable, comprehensive, and flexible health coverage.</p>
            </div>
            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                We are committed to protecting your health, securing your future, and supporting your family, so that you can focus on what you do best—caring for others
            </p>
        </div>
    </div>
  )
}

export default DeliveringCare