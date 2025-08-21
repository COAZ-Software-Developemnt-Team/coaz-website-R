import React, {useState,useEffect,useRef,useContext} from 'react'
import { GlobalContext } from '../contexts/GlobalContext';
import { IoCloseOutline } from "react-icons/io5";
import { FaRegCircleDot } from "react-icons/fa6";

const Person = ({person}) => {
    const {setDialog,screenSize} = useContext(GlobalContext);
    const [titleBarHeight,setTitleBarHeight] = useState(40);
    const [bodyHeight,setBodyHeight] = useState(64);
    const mainContainerRef = useRef(null);

    const calcHeights = (mainContainerHeight) => {
        setBodyHeight(mainContainerHeight - titleBarHeight);
    }

    useEffect(() => { 
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                let height = entry.target.getBoundingClientRect().height;
                calcHeights(height);
            }
        });

        if(mainContainerRef.current) {
            observer.observe(mainContainerRef.current)
        }
        return () => {
            observer.disconnect();
        }
    },[]);

    return (
        <div ref={mainContainerRef} 
            className='flex flex-col w-full lg:w-[50vw] h-auto overflow-hidden '>
            <div style={{height:titleBarHeight + 'px'}}
                className='flex flex-row w-full items-center justify-between px-4 text-[rgb(150,150,150)] text-sm font-jostBook tracking-wider bg-[rgb(247,247,247)]'>
                <p className='capitalize'>
                    {person && person.name}
                </p>
                <button onClick={(e) => setDialog(null)} className='flex w-6 h-6 shrink-0 hover:bg-[rgb(235,235,235)]'>
                    <IoCloseOutline size={24}/>
                </button>
            </div>
            <div className='flex flex-col w-full h-auto max-h-[80vh] pt-16 items-center no-scrollbar overflow-x-hidden overflow-y-auto bg-white'>
                <img src={person.image?person.image:person.gendar == 'male'?'/images/male.svg':'/images/female.svg'} 
                    style={{width:'288px',height:'345.6px'}}
                    className='flex object-cover shadow-xl rounded-md shrink-0'
                />
                <div className='flex flex-col items-center justify-center w-full h-auto py-8 space-y-2'>
                    <p className='flex w-auto h-auto text-[22px] text-[rgb(59,59,59)] font-semibold font-leBeauneNew'>
                        {person.name}
                    </p>
                    <p className='flex w-auto text-lg text-[rgb(100,100,100)] font-[arial] capitalize'>
                        {person.position}
                    </p>
                    {person.tenure && 
                    <p className='flex w-auto text-sm text-[rgb(100,100,100)] font-[arial] italic capitalize'>
                        {person.tenure}
                    </p>
                    }
                    {person.email &&
                        <p className='text-sm tracking-wider text-[rgb(100,100,100)] font-[arial] italic'>
                            {person.email}
                        </p>
                    }
                </div>
                <div className='flex flex-col space-y-8 w-full h-auto px-[10%] py-16 shrink-0 bg-[rgb(243,244,245)]'>
                    {person.about &&
                    <div className='flex flex-col w-full h-auto space-y-4'>
                        <p className='text-3xl font-leBeauneNew font-semibold'>About</p>
                        {person.about.map((about,i) =>
                        <p key={i} className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            {about}
                        </p>)}
                    </div>
                    }
                    {person.qualifications &&
                    <div className='flex flex-col w-full h-auto space-y-4'>
                        <p className='text-3xl font-leBeauneNew font-semibold'>Qualifications</p>
                        {person.qualifications.map((qualification,i) =>
                        <div key={i} className='flex flex-row space-x-4 cursor-pointer'>
                            <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                                {qualification}
                            </p>
                        </div>
                        )}
                    </div>
                    }
                    {person.contributions &&
                    <div className='flex flex-col w-full h-auto space-y-4'>
                        <p className='text-3xl font-leBeauneNew font-semibold'>contributions</p>
                        {person.contributions.map((contribution,i) =>
                        <div key={i} className='flex flex-row space-x-4 cursor-pointer'>
                            <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                                {contribution}
                            </p>
                        </div>
                        )}
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Person