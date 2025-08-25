import React, {useState,useEffect,useContext,useRef} from 'react'
import { useNavigate,useLocation} from 'react-router-dom';
import { GlobalContext } from '../contexts/GlobalContext';
import { organisation,findPerson } from '../data'
import { FaRegCircleDot } from "react-icons/fa6";
import Person from './Person'

const Organisation = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const {mainElementRef,findMenu,setDialog} = useContext(GlobalContext);
  const [imgHeight,setImgHeight] = useState(0);
  const [content,setContent] = useState(null);
  const textRef = useRef(null);
useEffect(() => {
    if (mainElementRef && mainElementRef.current) {
        mainElementRef.current.scrollTo({top: 0});
    }
}, [mainElementRef]);

  useEffect(() => {
    let currentItem = findMenu(organisation,path);
    if(!currentItem) {
        navigate('/home');
    }

    if(currentItem) {
        if(currentItem.menus) {
            navigate(currentItem.menus[0].link);
        }
        setContent(currentItem);
    }

    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            let rect = entry.target.getBoundingClientRect();
            setImgHeight(rect.height + 166);
        }
    });
    
    if(textRef.current) {
        observer.observe(textRef.current)
    }

    return () => {
        observer.disconnect();
    }
  },[path]);

  return (
    <div className='relative flex flex-col w-full h-auto bg-[rgb(243,244,245)]'>
      <div style={{height: imgHeight+'px'}}  className='relative flex flex-col w-full shrink-0 overflow-hidden'>
        <img src='/images/img_32.jpg' className='flex w-full h-full object-cover object-center overflow-hidden'/>
        <div className='absolute flex  left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.8)] via-transparent to-[rgba(0,0,0,.8)]'/>
        <div ref={textRef} className='absolute flex flex-col space-y-4 items-center justify-center top-[166px] w-full h-auto'>
          <div className='flex w-px h-24 border-l border-white'/>
          <p className='text-white text-center tracking-wide text-4xl lg:text-7xl font-leBeauneNew'> 
              organisation
          </p>
          <div className='flex w-px h-24 border-l border-white'/>
        </div>
      </div>
      <div className='relative flex flex-col w-full h-auto items-center shrink-0 mb-24'>
        <div className='flex w-[2px] h-16 border-r border-[rgb(204,204,204)]'/>
        <p className='w-full h-auto mt-8 text-4xl text-center text-[rgb(50,50,50)] font-leBeauneNew'>
          {content && content.name}
        </p>
      </div>
      <div className='flex flex-col w-full h-auto space-y-8 px-[10%] py-24 justify-center bg-[rgb(238,238,238)]'>
          {content && content.about &&
            <div className='flex flex-col w-full h-auto space-y-4'>
              <p className='text-3xl font-leBeauneNew font-semibold'>About</p>
              {content.about.map((about,i)=>
              <p key={i} className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                  {about}
              </p>)}
            </div>
          }
          {content && content.composition &&  
            <div className='flex flex-col w-full h-auto space-y-4'>
              <p className='text-3xl font-leBeauneNew font-semibold'>Composition</p>
              {content.composition.map((person,i) =>
              <div key={i} 
                onClick={(e) => 
                  {
                    let found = findPerson(person.position);
                    found && setDialog({show:true,Component: () => <Person person={found}/>});
                  }
                }
                className='flex flex-row space-x-4 cursor-pointer'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    {person.position}
                </p>
              </div>)}
            </div>
          }
          {content && content.employees &&  
            <div className='flex flex-col w-full h-auto space-y-4'>
              <p className='text-3xl font-leBeauneNew font-semibold'>Our staff</p>
              {content.employees.map((person,i)=>
              <div key={i} 
                onClick={(e) => setDialog({
                  show:true,
                  Component: () => <Person person={person}/>
                })}
                className='flex flex-row space-x-4 cursor-pointer'>
                <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    {person.position}
                </p>
              </div>)}
            </div>
          }
      </div>
    </div>
  )
}

export default Organisation