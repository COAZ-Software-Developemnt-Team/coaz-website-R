"use client"
import React,{useEffect,useRef,useState} from 'react'
import Button from '../components/Button'

const MainSlide = () => {
    const [current,setCurrent] = useState(null);
    const [next,setNext] = useState(null);
    const currentRef = useRef(null);
    const nextRef = useRef(null);

    const slides = [
        {
            Content: () => 
            <Slide 
                image='/images/img_59_sm.jpg' 
                text1='welcome to' 
                text2="The Clinical Officers' Association of Zambia"
                buttonText='Join us'
            />
        },
        {
            Content: () => 
            <Slide 
                image='/images/img_60_sm.jpg' 
                text1='we are your voice' 
                text2="Advocating for all Clinical Officers"
                buttonText='Join us'
            />
        }
    ]
    
    useEffect(() => {
        let i = 0;
        let index = 0;
        const interval = setInterval(() => {
            if(i == 0) {
                setCurrent({index:index,slide:slides[index]});
            }
            if(i == 1) {
                if(currentRef.current) {
                    currentRef.current.style.opacity = '1';
                    currentRef.current.style.transition ='none';
                }
                if(nextRef.current) {
                    nextRef.current.style.left = '16px';
                    nextRef.current.style.top = '16px';
                    nextRef.current.style.right = '16px';
                    nextRef.current.style.bottom = '16px';
                    nextRef.current.style.transition = 'none';
                }
            }
            if(i == 2) {
                if((index + 1) < slides.length) { 
                    setNext({index:index + 1,slide:slides[index + 1]});
                } else {
                    setNext({index:0,slide:slides[0]});
                }
            }
            if(i == 20) {
                if(currentRef.current) {
                    currentRef.current.style.opacity = '0';
                    currentRef.current.style.transition ='all .8s ease-in-out';
                }
                if(nextRef.current) {
                    nextRef.current.style.left = '0';
                    nextRef.current.style.top = '0';
                    nextRef.current.style.right = '0';
                    nextRef.current.style.bottom = '0';
                    nextRef.current.style.transition = 'all 1s  ease-in-out';
                }
                if(index < slides.length - 1) {
                    index++;
                } else {
                    index = 0;
                }
            }
            if(i < 20) {
                i++;
            } else {
                i = 0;
            }
        },500);
        
        return () => {
            clearInterval(interval);
        }
    },[])

    return (
        <div className='relative flex flex-col w-full h-[70vh] shrink-0 overflow-hidden bg-white'>
            {next && 
                <div ref={nextRef} style={{left:'16px',top:'16px',right:'16px',bottom:'16px'}} 
                    className='absolute overflow-hidden'>
                    {next && next.slide && next.slide.Content && <next.slide.Content/>}
                </div>
            }
            {current && current.slide &&
                <div ref={currentRef} style={{left:'0',top:'0',right:'0',bottom:'0'}} 
                    className='absolute overflow-hidden'>
                    {current && current.slide && current.slide.Content && <current.slide.Content/>}
                </div>
            }
            {/* <div className='absolute flex left-0 top-0 w-full h-full bg-white opacity-80 shrink-0'/> */}
            {/* <div style={{background:"linear-gradient(to right, rgb(243,244,245) 0%,rgb(243,244,245,.5) 50%,rgb(243,244,245,.1) 60%,transparent 100%)"}}
             className='absolute flex left-0 top-0 w-full h-full shrink-0'/> */}
            {/* <div className='absolute flex left-0 top-0 w-full h-full shrink-0 bg-[rgb(0,0,0,.2)]'/> */}
            {/* <div className='absolute flex left-0 top-0 w-full h-full shrink-0 bg-[rgb(255,255,255,.5)]'/> */}
            {/* <div className='absolute flex w-full h-full'>
                {current && current.slide && current.slide.Content && <current.slide.Content/>}
            </div> */}
            <div className='absolute flex flex-row space-x-2 items-center justify-center bottom-0 w-full h-[96px]'>
                {slides && (
                    (() => {
                        let bullets = [];
                        for(let i = 0;i < slides.length;i++) {
                            bullets.push(<Bullet key={i} index={i} current={current}/>);
                        }
                        return bullets;
                    })()
                )}
            </div>
            {/* <img src='/images/img_11.jpg' className='flex top-0 w-full h-full object-top object-cover'/>
            <div className='absolute flex left-0 top-0 w-full h-full shrink-0 bg-linear-to-r from-white via-transparent to-transparent'/>
            <div className='absolute flex flex-col space-y-4 justify-center w-full h-full px-[10%]'>
                <p className='test-sm text-[rgb(0,175,240)] tracking-widest whitespace-nowrap font-winston-bold'> 
                    WELCOME TO
                </p>
                <p className='w-[50%] h-[128px] text-[rgb(68,71,70)] text-5xl font-winston-black'> 
                    The Clinical Officers' Association of Zambia
                </p>
                <button className='w-fit h-fit px-10 py-4 font-winston-regular text-white bg-[rgb(0,175,240)] rounded-full'>
                    Join us
                </button>
            </div> */}
        </div>
    )
}

export default MainSlide

const Slide = ({image,text1,text2,buttonText,onClickButton}) => {
    return (
        <div className='relative flex w-full h-full px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] font-nunito'>
            <img src={image} className='absolute left-0 top-0 w-full h-full object-cover bg-center'/>
            <div className='absolute flex  left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.5)] via-transparent to-[rgba(0,0,0,.5)]'/>
            <div className='relative flex flex-row w-full h-full'>
                <div className='flex flex-col w-full md:w-[60%] h-full justify-center items-center md:items-start space-y-16'>
                    <div className='flex flex-col w-full h-fit space-y-4'>
                        <span className='text-sm text-white font-nunitoSansBold tracking-[2px] text-center md:text-left uppercase'>{text1}</span>
                        <p className='text-[40px]/[1.2em] lg:text-[60px]/[1.2em] text-white font-nunitoSansBlack text-center md:text-left'>{text2}</p>
                    </div>
                    <Button text={buttonText} onClick={onClickButton}/>
                </div>
            </div>
        </div>
    )
}

const Bullet = ({index,current}) => {
    useEffect(() => {
        
    })
  return (
      <div 
        style={{transition:'all 1s ease-in-out'}} 
        className={`flex w-2 h-2 z-20 rounded-full ${current && current.index === index?'bg-[rgb(0,175,240)]':'bg-[rgb(223,223,223)]'} cursor-pointer`}
      />
  )
}