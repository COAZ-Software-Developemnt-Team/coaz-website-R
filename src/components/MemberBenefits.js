import React from 'react'
import { FaRegCircleDot } from "react-icons/fa6";
import ReadMoreSection from "./ReadMore";


const MemberBenefits = () => {
  return (
    <div className='flex flex-col space-y-8 w-full h-auto'>
        <div className='flex flex-col w-full h-auto'>
            <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                COAZ is committed to directly supporting members through customized insurance solutions that meet their real needs. Planned initiatives include:
            </p>
        </div>
        <p className='text-2xl font-leBeauneNew font-semibold'>COAZ Group Health Insurance Scheme </p>
        <div className='flex flex-col space-y-8 w-full h-auto'>
            <div className='flex flex-row space-x-4'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    	Negotiating with reputable insurers to provide collective coverage for Clinical Officers at affordable premiums.                </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Leveraging membership numbers to maximize value and reduce individual costs.                </p>
            </div>
        </div>
        <ReadMoreSection>
        <p className='text-2xl font-leBeauneNew font-semibold'>Family Coverage Options </p>
        <div className='flex flex-col space-y-8 w-full h-auto'>
            <div className='flex flex-row space-x-4'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Extending insurance benefits to spouses and dependents, ensuring the whole family is protected.               </p>
            </div>
            <div className='flex flex-row space-x-4'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Promoting preventive care and early diagnosis for family members.               </p>
            </div>
            <p className='text-2xl font-leBeauneNew font-semibold'>Specialist Services Coverage </p>
            <div className='flex flex-col space-y-8 w-full h-auto'>
                <div className='flex flex-row space-x-4'>
                    <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                    <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                        Including services often overlooked by standard insurance, such as mental health support, eye care, and non-communicable disease (NCD) management.              </p>
                </div>
                <div className='flex flex-row space-x-4'>
                    <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                    <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                        Ensuring members have access to specialist consultations and treatment when needed.             </p>
                </div>
            </div>
            <p className='text-2xl font-leBeauneNew font-semibold'>Emergency Cover</p>
            <div className='flex flex-col space-y-8 w-full h-auto'>
                <div className='flex flex-row space-x-4'>
                    <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                    <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                        Immediate support for accidents, critical illness, and emergency hospitalizations.             </p>
                </div>
                <div className='flex flex-row space-x-4'>
                    <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                    <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                        Covering transport and urgent medical interventions to save lives and reduce financial burden.            </p>
                </div>
            </div>
            <p className='text-2xl font-leBeauneNew font-semibold'>Flexible Premium Options</p>
            <div className='flex flex-col space-y-8 w-full h-auto'>
                <div className='flex flex-row space-x-4'>
                    <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                    <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                        Monthly, quarterly, or annual payment models to ease financial planning.             </p>
                </div>
                <div className='flex flex-row space-x-4'>
                    <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                    <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                        Encouraging broader participation by providing payment flexibility.  </p>
                </div>
                <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                    By pooling resources and bargaining power, COAZ ensures that health insurance is affordable, accessible, and tailored to the unique needs of Clinical Officers.                </p>
                <p className='w-full h-auto text-lg text-[rgb(100,100,100)] space-y-6 font-jostBook'>
                    <a
                        href="/association/delivering_care"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                    >
                        How To Get Involved
                    </a>

                    </p>
            </div>
        </div>
        </ReadMoreSection>
    </div>
  )
}

export default MemberBenefits