import React from 'react'
import { FaRegCircleDot } from "react-icons/fa6";

const MemberBenefits = () => {
  return (
    <div className='flex flex-col space-y-16 w-full h-auto'>
        <div className='flex flex-col w-full h-auto'>
            <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                Joining the nation’s largest Health professional Organization in Zambia has considerable benefits. In 
                addition to opportunities to shape the future of health care, COAZ membership benefits include exclusive 
                access to savings and resources designed to enhance the personal and professional lives of Members
            </p>
        </div>
        <div className='flex flex-col space-y-8 w-full h-auto'>
            <div className='flex flex-row space-x-4'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Legal Representation – legal@coaz.org
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Loan & Financial Services – Coming soon
                </p>
            </div>
        </div>
        <div className='flex flex-col space-y-8 w-full h-auto'>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>1.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Exclusive access to savings on healthcare-related products and services – coming soon
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>2.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Resources and support tailored to enhance personal and professional development
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>3.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Networking opportunities with fellow health professionals
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>4.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Influence in shaping the future of healthcare in Zambia
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>5.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Continuing education (CPD) 
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>6.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Access to training and workshops 
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>7.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Advocacy and representation on issues affecting the profession 
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>8.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Mentorship programs for career guidance and support 
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>9.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Recognition and awards for outstanding contributions to the healthcare community 
                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <p className='font-jostSemi text-[rgb(85,85,85)] text-lg'>10.</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Participation in community outreach and health promotion activities 
                </p>
            </div>
        </div>
    </div>
  )
}

export default MemberBenefits