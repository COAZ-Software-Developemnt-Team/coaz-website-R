import React, {useEffect, useRef, useState} from 'react'
import {partners} from '../data';

const Partners = () => {
    const [columns,setColumns] = useState(partners? partners.length:0);
    const [itemSize,setItemSize] = useState({});
    const partnersRef = useRef(null)

    const calWidth = (pw,mw,pa,sp,cols) => {
        if(cols === 0){
            return {w:0,cols:0};
        }
        let w = 0;
        let aw = pw - (pa*2) - (sp * (cols - 1));
        w = aw/cols;
        if(w < mw && cols > 1) {
            cols -= 1;
            return calWidth(pw,mw,pa,sp,cols)
        } else {
            return {w,cols};
        }
    }

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                let minWidth = 450;
                let paddingX = 32;
                let spaceX = 32;
                let parentWidth = entry.target.getBoundingClientRect().width;
                let {w,cols} = calWidth(parentWidth,minWidth,paddingX,spaceX,columns); 
                let h = (449*w)/640;
                setItemSize({width:w,height:h});
                setColumns(cols);
            }
        });
  
        if(partnersRef.current) {
            observer.observe(partnersRef.current)
        }
        return () => {
            observer.disconnect();
        }
    },[]);
  return (
    <div className='w-full h-auto mt-16 bg-[rgb(238,238,238)]'>
        <div className='flex flex-col lg:flex-row w-full h-auto'>
            <div className='flex flex-col space-y-4 items-center justify-center w-full lg:w-1/2 h-auto p-8 sm:p-16'>
                {/* <CIHandShake size={80} fill='black'/> */}
                <p className='text-3xl font-leBeauneNew font-semibold'>Stakeholders and Partners</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    COAZ collaborates with government agencies, healthcare institutions, and other stakeholders
                    to strengthen the role of clinical officers in Zambia's healthcare system. Learn more about
                    our partnerships and how we work together to advocate for quality healthcare delivery and 
                    professional advancement
                </p>
            </div>
            <div className='flex flex-col w-full lg:w-1/2 h-64 sm:h-96 lg:h-[512px] shrink-0 bg-[url(/public/images/img_32.jpg)] bg-cover'></div>
        </div>
        <div ref={partnersRef}
            className='flex flex-col space-y-8 w-[90%] h-auto my-16 mx-auto p-8 bg-[rgb(247,247,247)] border-t-2 border-[rgb(0,175,240)]'>
            {partners && (
                (() => {
                    const rows = [];
                    let rowKey = 0;
                    for (let i = 0; i < partners.length;) {
                        const row = [];
                        for (let j = 0; j < columns; j++) {
                            if(i < partners.length) {
                                row.push(<Partner key={i} img={partners[i].image} description={partners[i].description} size={itemSize}/>);
                                i++;
                            } else {
                                break;
                            }
                        }
                        rows.push(<div key={rowKey} className={`flex flex-row w-auto h-auto shrink-0 space-x-8`}>{row}</div>);
                        rowKey++;
                    }
                    return rows;
                })()
            )}
        </div>
    </div>
  )
}

const Partner = ({img,description,size}) => {
    return (
        <div style={{width:size.width+'px'}}
            className='flex flex-col sm:flex-row sm:space-x-4 w-full h-auto'>
            <img src={img} alt='img' className='w-full sm:w-1/4 h-auto object-contain'/>
            <p className='w-full sm:w-3/4 h-auto my-auto p-1 sm:p-4 text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>{description}</p>
        </div>
        
    )
}

export default Partners