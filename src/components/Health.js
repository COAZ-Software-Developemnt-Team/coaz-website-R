import React,{useState,useEffect} from 'react'
import {GoDotFill} from "react-icons/go";
import ReadMoreSection from "./ReadMore";


const Health = () => {


    return (
        <div>
            <p className='text-3xl font-leBeauneNew font-semibold'>About The Platform</p>
            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                The COAZ Health Insurance Platform is a comprehensive insurance solution designed specifically for
                Clinical Officers and healthcare professionals in Zambia. We understand that frontline health workers
                often face challenges accessing timely and affordable healthcare, which is why this platform:
                <ReadMoreSection>
                <div className="flex flex-col space-y-4 mt-6 w-full">
                    <div className="flex flex-row space-x-4">
                        <GoDotFill
                            size={16}
                            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                        />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            	Ensures Financial Security: Prevents medical costs from becoming a barrier to care.                                       </p>
                    </div>
                    <div className="flex flex-col space-y-4 mt-6 w-full">
                        <div className="flex flex-row space-x-4">
                            <GoDotFill
                                size={16}
                                className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                            />
                            <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                	Nationwide Access: Connects you with accredited healthcare providers across Zambia, from urban hospitals to rural clinics.                                        </p>
                        </div>
                        <div className="flex flex-col space-y-4 mt-6 w-full">
                            <div className="flex flex-row space-x-4">
                                <GoDotFill
                                    size={16}
                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                />
                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                    	Full Spectrum of Care: Covers routine check-ups, specialist consultations, emergency treatment, and chronic disease management.                                      </p>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4 mt-6 w-full">
                            <div className="flex flex-row space-x-4">
                                <GoDotFill
                                    size={16}
                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                />
                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                    	Peace of Mind: Allows you to focus on your work and family without worrying about unexpected health expenses.                                        </p>
                            </div>
                        </div>
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            Whether it’s a routine health screening, specialized treatment, or emergency care, COAZ ensures that your health is protected at all times.
                        </p>
                        <p className='text-3xl font-leBeauneNew font-semibold'>Advocacy on Health Insurance in Zambia</p>
<p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
    <a
        href="/association/advocacy_in_health_care"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue-600"
    >
        Learn More
    </a>
</p>
                    </div>
                </div>
                </ReadMoreSection>
            </p>
        </div>
    )
}

export default Health



