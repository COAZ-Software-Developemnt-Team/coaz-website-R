import React, {useEffect,useState,useContext} from 'react'
import { GlobalContext } from '../contexts/GlobalContext';
import { useNavigate,useLocation } from 'react-router-dom';
import {membership} from '../data'

const Membership = () => {
    const {mainElementRef,findMenu} = useContext(GlobalContext);
    const navigate = useNavigate();
    const path = useLocation().pathname;
    const [content,setContent] = useState(null);

    if(mainElementRef.current) {
        mainElementRef.current.scrollTo({top: 0});
    }
    
    useEffect(() => { 
        let currentItem = findMenu(membership,path);
        if(!currentItem) {
            navigate('/home');
        }

        if(currentItem) {
            if(currentItem.menus) {
                navigate(currentItem.menus[0].link);
            }
            setContent(currentItem);
        }
    },[path]);

    return (
        <div className='relative flex flex-col w-full h-auto'>
            <div className='relative flex flex-col w-full h-[60vh] shrink-0 overflow-x-hidden overflow-y-auto'>
                {content && <img src='/images/img_46.jpg' className='flex w-full h-full object-cover overflow-hidden'/>}
                <div className='absolute flex  left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.8)] via-transparent to-[rgba(0,0,0,.8)]'/>
                <div className='absolute flex flex-col justify-end top-[166px] bottom-0 w-full px-[10%]'>
                    <div className='flex flex-col w-full space-y-4 items-center justify-center mb-8'>
                    </div>
                    <p className='text-white tracking-wide text-4xl lg:text-7xl font-leBeauneNew'> 
                        {content && content.name}
                    </p>
                    <div className='flex w-[2px] h-16 border-r border-white'/>
                </div>
            </div>
            <div className='relative flex flex-col space-y-4 w-full h-auto px-[10%] pb-16 shrink-0 bg-[rgb(243,244,245)]'>
                <div className='flex w-[2px] h-24 border-l border-[rgb(204,204,204)]'/>
                {content && 
                    <div className='flex flex-col space-y-16 w-full h-auto'>
                        {content.EligibilityCriteria && <content.EligibilityCriteria/>}
                        {content.RightsAndPrivileges && <content.RightsAndPrivileges/>}
                        {content.ObligationsAndResponsibilities && <content.ObligationsAndResponsibilities/>}
                        {content.GroundsForTermination && <content.GroundsForTermination/>}
                        {content.TerminationProcedure && <content.TerminationProcedure/>}
                    </div>
                }
            </div>
        </div>
      )
}

export default Membership