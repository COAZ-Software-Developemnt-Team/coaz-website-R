import React, {useContext, useEffect, useRef, useState} from 'react'
import {GlobalContext} from '../contexts/GlobalContext';
import {useLocation, useNavigate} from 'react-router-dom';
import {professionalCategories} from '../data'

const ProfessionalCategories = () => {
    const {mainElementRef,findMenu,screenSize} = useContext(GlobalContext);
    const navigate = useNavigate();
    const path = useLocation().pathname;
    const [content,setContent] = useState(null);
    const [itemSize,setItemSize] = useState({});
    const [columns,setColumns] = useState(0);
    const [cells,setCells] = useState([]);
    var maxColumns = 0;
    const gridRef = useRef(null)

    /* if(mainElementRef.current) {
        mainElementRef.current.scrollTo({top: 0});
    } */

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
        let currentItem = content;
        if(!currentItem) {
            currentItem = findMenu(professionalCategories,path);
            if(!currentItem) {
                navigate('/home');
            }
            
            if(currentItem) {
                if(currentItem.menus) {
                    navigate(currentItem.menus[0].link);
                }
                setContent(currentItem);
                
            }
        } else {
            let newCells = [
                {
                    image:'/images/img_50.jpg',
                    label:'Minimum credit requirement',
                    value:currentItem.minimumCreditRequirement
                },
                {
                    image:'/images/img_51.jpg',
                    label:'Limitations in drug Prescription',
                    value:currentItem.limitationsInDrugPrescription
                },
                {
                    image:'/images/img_52.jpg',
                    label:'Limitation in Statutory and legal document signatory',
                    value:currentItem.limitationInStatutoryAndLegalDocumentSignatory
                },
                {
                    image:'/images/img_53.jpg',
                    label:'Administration',
                    value:currentItem.administration
                }
            ];
            setCells(newCells);
            maxColumns = newCells.length;
        }

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                let minWidth = 450;
                let paddingX = 0;
                let spaceX = 32;
                let parentWidth = entry.target.getBoundingClientRect().width;
                let {w,cols} = calWidth(parentWidth,minWidth,paddingX,spaceX,maxColumns); 
                let h = (449*w)/640;
                setItemSize({width:w,height:h});
                setColumns(cols);
            }
        });
        if(gridRef.current) {
            observer.observe(gridRef.current)
        }
        return () => {
            observer.disconnect();
        }
    },[path,content]);

    return (
        <div className='relative flex flex-col w-full h-auto bg-[rgb(243,244,245)]'>
            <div className='relative flex flex-col w-full h-[300px] shrink-0 overflow-x-hidden overflow-y-auto'>
                <img src='/images/img_48.jpg' className='flex w-full h-full object-cover overflow-hidden'/>
                <div className='absolute flex  left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.8)] via-transparent to-[rgba(0,0,0,.8)]'/>
                <div className='absolute flex flex-col justify-end top-[166px] bottom-0 w-full px-[10%]'>
                    <p className='text-white tracking-wide text-4xl lg:text-7xl font-leBeauneNew'> 
                        {content && content.name}
                    </p>
                    <div className='flex w-[2px] h-16 border-r border-white'/>
                </div>
            </div>
            <div className='relative flex flex-col space-y-4 w-full h-auto px-[10%] pb-16 shrink-0'>
                <div className='flex w-[2px] h-24 border-l border-[rgb(204,204,204)]'/>
                {content && !content.name.toLowerCase().includes('specialized')?
                    <div className='flex flex-col space-y-16 w-full h-auto'>
                        <div className='relative flex flex-col w-full h-auto space-y-8 shrink-0'>
                            <p className='w-full h-auto text-4xl text-[rgb(50,50,50)] font-leBeauneNew'>
                                area of practice
                            </p>
                            <p style={{fontSize:'18px',lineHeight:'32px'}} className='w-full h-auto font-jostBook text-[rgb(85,85,85)]'>
                                {content.areaOfPractice}
                            </p>
                        </div>
                        <div className='flex flex-col sm:flex-row w-full h-[400px] p-8 items-center sm:space-x-4 justify-between bg-[url(/public/images/img_49.jpg)] bg-top bg-cover shadow-lg rounded-md'>
                            <div className='flex flex-col w-full sm:w-1/2 h-auto space-y-4'>
                                <p className='text-2xl sm:text-4xl text-white font-bold font-leBeauneNew tracking-wider uppercase'>Qualification</p>
                                <p className='text-lg sm:text-2xl text-white font-jostBook tracking-wider'>
                                    {content.qualification}
                                </p>
                            </div>
                            <div className='flex flex-col w-full sm:w-1/2 h-auto space-y-4 p-4 items-center rounded-lg bg-white'>
                                <img src='/images/zqa.jpg' className='w-fit h-fit object-cover '/>
                                <p className='text-2xl sm:text-4xl font-futuraMedium text-[rgb(4,121,188)] tracking-wider uppercase'>
                                    {content.zambiaQualificationAuthority}
                                </p>
                            </div>
                        </div>
                        <div ref={gridRef}
                            className='flex flex-col w-full h-auto space-y-8 pt-16 border-t-2 border-[rgb(0,175,240)]'>
                            {cells && (
                                (() => {
                                    const rows = [];
                                    let rowKey = 0;
                                    for (let i = 0; i < cells.length;) {
                                        const row = [];
                                        if(columns < 1) {
                                            break;
                                        }
                                        for (let j = 0; j < columns; j++) {
                                            if(i < cells.length) {
                                                row.push(<Cell key={i} cell={cells[i]} size={itemSize}/>);
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
                    </div>:
                    <div>

                    </div>
                }
                
            </div>
            {/* <div className='relative flex flex-col w-full h-auto items-center shrink-0 mb-24'>
                <div className='flex w-[2px] h-16 border-r border-[rgb(204,204,204)]'/>
                <p className='w-full h-auto mt-8 text-4xl text-center text-[rgb(50,50,50)] font-leBeauneNew'>
                {content && content.name}
                </p>
            </div>
            <div className='relative flex flex-col w-full h-auto space-y-8 px-[10%] py-16 shrink-0 text-[rgb(85,85,85)] bg-[rgb(238,238,238)]'>
                {content && !content.name.toLowerCase().includes('specialized')?
                    <>
                        <div className='flex flex-col lg:flex-row lg:space-x-8 items-center'>
                            <PiCertificateLight size={64} className='shrink-0'/>
                            <p className='lg:w-96 text-lg text-center lg:text-left tracking-wider font-jostSemi'>
                                Qualification:
                            </p>
                            <p className='text-lg text-center lg:text-left tracking-wider font-jostBook'>
                                {content && content.qualification}
                            </p>
                        </div>
                        <div className='flex flex-col lg:flex-row lg:space-x-8 items-center'>
                            <LiaCertificateSolid size={64} className='shrink-0'/>
                            <p className='lg:w-96 text-lg text-center lg:text-left shrink-0 tracking-wider font-jostSemi capitalize'>
                                Zambia Qualification Authority:
                            </p>
                            <p className='text-lg text-center lg:text-left tracking-wider font-jostBook'>
                                {content && content.zambiaQualificationAuthority}      
                            </p>
                        </div>
                        <div className='flex flex-col lg:flex-row lg:space-x-8 items-center'>
                            <GiSpeedometer size={64} className='shrink-0'/>
                            <p className='lg:w-96 text-lg text-center lg:text-left shrink-0 tracking-wider font-jostSemi capitalize'>
                                Minimum credit requirement:
                            </p>
                            <p className='text-lg text-center lg:text-left tracking-wider font-jostBook '>
                                {content && content.minimumCreditRequirement}
                            </p>
                        </div>
                        <div className='flex flex-col lg:flex-row lg:space-x-8 items-center'>
                            <LiaHospitalSolid size={64} className='shrink-0'/>
                            <p className='lg:w-96 text-lg text-center lg:text-left shrink-0 tracking-wider whitespace-nowrap font-jostSemi capitalize'>
                                Area of practice:
                            </p>
                            <p className='text-lg text-center lg:text-left tracking-wider font-jostBook'>
                                {content && content.areaOfPractice}
                            </p>
                        </div>
                        <div className='flex flex-col lg:flex-row lg:space-x-8 items-center'>
                            <BsPrescription size={64} className='shrink-0'/>
                            <p className='lg:w-96 text-lg text-center lg:text-left shrink-0 tracking-wider whitespace-nowrap font-jostSemi capitalize'>
                                Limitations in drug Prescription:
                            </p>
                            <p className='text-lg text-center lg:text-left tracking-wider font-jostBook'>
                                {content && content.limitationInDrugPrescription}
                            </p>
                        </div>
                        <div className='flex flex-col lg:flex-row lg:space-x-8 items-center'>
                            <LiaFileSignatureSolid size={64} className='shrink-0'/>
                            <p className='lg:w-96 text-lg text-center lg:text-left shrink-0 tracking-wider font-jostSemi capitalize'>
                                Limitation in Statutory and legal document signatory:
                            </p>
                            <p className='text-lg text-center lg:text-left tracking-wider font-jostBook'>
                                {content && content.limitationInStatutoryAndLegalDocumentSignatory}
                            </p>
                        </div>
                        <div className='flex flex-col lg:flex-row lg:space-x-8 items-center'>
                            <GrUserAdmin size={64} className='shrink-0'/>
                            <p className='lg:w-96 text-lg text-center lg:text-left shrink-0 tracking-wider font-jostSemi capitalize'>
                                Administration:
                            </p>
                            <p className='text-lg text-center lg:text-left tracking-wider font-jostBook'>
                                {content && content.administration} 
                            </p>
                        </div>
                    </>
                    :
                    <div className='flex flex-col w-full h-auto space-y-8'>
                        <PiCertificateLight size={128} className='flex mx-auto shrink-0'/>
                        <p className='text-xl shrink-0 tracking-wider font-jostSemi capitalize'>
                            MSc clinical Ophthalmology 
                        </p>
                        <p className='text-xl shrink-0 tracking-wider font-jostSemi capitalize'>
                            Master of public health
                        </p>
                        <p className='text-xl shrink-0 tracking-wider font-jostSemi capitalize'>
                            Master of Science in Infectious diseases 
                        </p>
                        <p className='text-xl shrink-0 tracking-wider font-jostSemi capitalize'>
                            The Association is advocating for; 
                        </p>
                        <div className='flex flex-row space-x-4 items-center'>
                            <GoDotFill size={16} className='shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook'>
                                Master of science in Clinical Medicine – Tropical Medicine
                            </p>
                        </div>
                        <div className='flex flex-row space-x-4 items-center'>
                            <GoDotFill size={16} className='shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook'>
                                Master of Science in Clinical Medicine – Anesthesia and critical care
                            </p>
                        </div>
                        <div className='flex flex-row space-x-4 items-center'>
                            <GoDotFill size={16} className='shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook'>
                                Master of Science in Clinical Medicine – Dermatovenerology
                            </p>
                        </div>
                        <div className='flex flex-row space-x-4 items-center'>
                            <GoDotFill size={16} className='shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook'>
                                Master of clinical medicine – Community psychiatry and mental health
                            </p>
                        </div>
                        <div className='flex flex-row space-x-4 items-center'>
                            <GoDotFill size={16} className='shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook'>
                                MSc Clinical Medicine – ENT
                            </p>
                        </div>
                        <div className='flex flex-row space-x-4 items-center'>
                            <GoDotFill size={16} className='shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook'>
                                MSC Clinical Medicine – Cancer and Clinical Oncology
                            </p>
                        </div>
                        <div className='flex flex-row space-x-4 items-center'>
                            <GoDotFill size={16} className='shrink-0'/>
                            <p className='text-lg tracking-wider font-jostBook'>
                                MSc Clinical Ophthalmology
                            </p>
                        </div>
                    </div>
                }
            </div> */}
        </div>
      )
}

export default ProfessionalCategories

const Cell = ({cell,size}) => {
    return (
        <div style={{width:size.width+'px'}}
            className='flex flex-col sm:flex-row sm:space-x-4 w-full h-auto'>
            <img style={{'--width':size.width+'px','--height':((size.width * 9)/16)+'px'}}
                src={cell?cell.image:''}
                className='w-(--width) sm:w-32 h-(--height) sm:h-[72px] shrink-0 object-cover rounded-md shadow-md'/>
            <div className='flex flex-col w-full h-auto space-y-2'>
                <p className='w-full h-auto text-lg tracking-wider font-jostSemi text-[rgb(85,85,85)]'>
                    {cell?cell.label:''}
                </p>
                <p className='w-full h-auto tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    {cell?cell.value:''}
                </p>
            </div>
        </div>
        
    )
}