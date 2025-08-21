import React from 'react'
import { FaRegCircleDot } from "react-icons/fa6";

const AwardsAndCertificates = () => {
  return (
    <div className='w-full h-auto mt-16 bg-[rgb(238,238,238)]'>
        <div className='flex flex-col lg:flex-row w-full h-auto '>
            <div className='flex flex-col w-full lg:w-1/2 h-64 sm:h-96 lg:h-[512px] shrink-0 bg-[url(/public/images/img_31.jpg)] bg-cover'/>
            <div className='flex flex-col space-y-4 justify-center w-full lg:w-1/2 h-auto p-8 sm:p-16'>
                {/* <CIAward size={80} fill='black'/> */}
                <p className='text-3xl font-leBeauneNew font-semibold'>Awards and Certificates</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    COAZ recognizes excellence among clinical officers in Zambia through our awards and
                    certification programs. Explore how we honor outstanding achievements and promote 
                    continuous professional development within our community
                </p>
                <div className='flex flex-row space-x-4 items-center'>
                  <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] shrink-0'/>
                  <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>Most Hard-Working Clinical Offer Award</p>
                  </div>
                  <div className='flex flex-row space-x-4 items-center'>
                  <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] shrink-0'/>
                  <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>Others coming soon</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AwardsAndCertificates