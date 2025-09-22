import React from 'react'
import { FaRegCircleDot } from "react-icons/fa6";
import ReadMoreSection from "./ReadMore";

const AwardsAndCertificates = () => {
  return (
    <div className='w-full h-auto mt-16 bg-[rgb(238,238,238)]'>
        <div className='flex flex-col lg:flex-row w-full h-auto '>
            <div className='flex flex-col w-full lg:w-1/2 h-64 sm:h-96 lg:h-[512px] shrink-0 bg-[url(/public/images/img_31.jpg)] bg-cover'/>
            <div className='flex flex-col space-y-4 justify-center w-full lg:w-1/2 h-auto p-8 sm:p-16'>
                {/* <CIAward size={80} fill='black'/> */}
                <p className='text-3xl font-leBeauneNew font-semibold'>Awards and Certificates</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    The Clinical Officers Association of Zambia (COAZ) recognizes excellence among clinical officers in Zambia through their Awards and Certificates program. This initiative aims to honor outstanding contributions in healthcare and encourage professional development within the clinical officer community. For more detailed information on the specific awards, eligibility criteria, and application processes, you can visit the COAZ Awards and Certificates page: coaz.org.
                </p>
                <p className='text-3xl font-leBeauneNew font-semibold'>Types Of Awards</p>
<ReadMoreSection>
                <div className='flex flex-row space-x-4 items-center'>
                  <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] shrink-0'/>
                  <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                      	Clinical Excellence Awards: Recognizing outstanding patient care and clinical skills.
                  </p>
                  </div>
                  <div className='flex flex-row space-x-4 items-center'>
                  <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] shrink-0'/>
                  <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                      	Leadership and Innovation Awards: Honoring individuals who demonstrate leadership and introduce innovative practices in healthcare.
                  </p>
                </div>
    <div className='flex flex-row space-x-4 items-center'>
        <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] shrink-0'/>
        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
            Community Service Awards: Acknowledging contributions to public health initiatives and community outreach.        </p>
    </div>
    <div className='flex flex-row space-x-4 items-center'>
        <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] shrink-0'/>
        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
            Research and Academic Excellence Awards: Celebrating significant contributions to medical research and education.        </p>
    </div>
</ReadMoreSection>
            </div>

        </div>
    </div>
  )
}

export default AwardsAndCertificates