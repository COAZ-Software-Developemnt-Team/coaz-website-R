import React, {useState,useEffect,useContext,useRef} from 'react'
import { GlobalContext } from '../contexts/GlobalContext';
import { TbTargetArrow } from "react-icons/tb";
import { FaListCheck } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { GiFlagObjective } from "react-icons/gi";
import {findPerson} from '../data';
import Person from './Person'

const About = () => {
    const {mainElementRef} = useContext(GlobalContext);
useEffect (() => {
    if (mainElementRef && mainElementRef.current) {
        mainElementRef.current.scrollTo({top: 0});
    }
}, [mainElementRef]);
  return (
    <div className='relative flex flex-col w-full h-auto'>
        <div className='relative flex flex-col w-full h-[60vh] shrink-0 overflow-x-hidden overflow-y-auto'>
            <img src='/images/img_35.jpg' className='flex w-full h-full object-cover object-top overflow-hidden'/>
            <div className='absolute flex  left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.8)] via-transparent to-[rgba(0,0,0,.8)]'/>
            <div className='absolute flex flex-col space-y-4 items-center justify-center top-[166px] bottom-0 w-full'>
                <div className='flex w-px h-16 shrink-0 border-l border-white'></div>
                <p className='text-white tracking-wide whitespace-nowrap text-xl font-leBeauneNew'> 
                    ABOUT
                </p>
                <p className=' text-white tracking-wide text-center text-7xl lg:text-9xl font-leBeauneNew'> 
                    COAZ
                </p>
                <div className='flex w-px h-full mx-auto border-r border-white'/>
            </div>
        </div>
        <div className='relative flex flex-col w-full h-auto px-[10%] shrink-0 bg-white'>
            <div className='flex w-[2px] h-20 mx-auto border-r border-[rgb(204,204,204)]'></div>
            <p className='flex w-auto h-auto mx-auto mt-8  text-md text-[rgb(150,150,150)] font-leBeauneNew'>
                about us
            </p>
            <p style={{fontSize:42+'px',lineHeight:52+'px'}} className='flex w-[90%] lg:w-[600px] h-auto mt-8 mx-auto text-center text-[rgb(50,50,50)] font-leBeauneNew'>
                we welcome you to learn more about us
            </p>
            <div className='flex h-24 shrink-0 border-l border-[rgb(204,204,204)]'></div>
            <div className='flex flex-col w-full h-auto space-y-8 pb-16'>
                <div className='flex flex-col space-y-4 w-full h-auto'>
                    <p className='text-lg mt-4 text-[rgb(85,85,85)] font-jostBook'>
                        Founded in 1967, the Clinical Officers Association of Zambia (COAZ) is the largest and only
                        national association that convenes 116+  District Branches and Sub-division Clinical 
                        Professional societies and other critical stakeholders. Throughout history, the COAZ has 
                        always followed its mission
                    </p>
                    <p className='text-[rgb(85,85,85)] text-lg font-jostBook'>
                        As the Clinicians’ powerful ally in Health care, the COAZ delivers on this mission by 
                        representing Clinical officers and clinical Practitioners with a unified voice in health and 
                        legislative bodies across the nation, removing obstacles that interfere with our practice, 
                        patient care, leading the charge to decentralized health care and confront public health crises, 
                        and driving the future to tackle the biggest challenges in health care and training the leaders 
                        of tomorrow
                    </p>
                    <p className='text-[rgb(85,85,85)] text-lg font-jostBook'>
                        The COAZ system of governance and policy making include the National Executive committee, 
                        Committees of the Executive, National Investment Board. In Administration are Employees and 
                        staff of the association
                    </p>
                    <p className='text-[rgb(85,85,85)] text-lg font-jostSemi'>
                        The Association was formally re-registered under societies Act Cap 118 in 2012 to;
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            promote Clinical practitioners' welfare
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Provide continuous professional development
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Promote community involvement
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Support Healthcare service delivery In Zambia as a mean of championing interests of our members
                        </p>
                    </div>
                    <p className='text-[rgb(85,85,85)] text-lg font-jostBook'>
                        This is achieved through;
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Training
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Capacity building
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Advocacy
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Mobilization
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Socio-economic empowerment
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Policy engagements
                        </p>
                    </div>
                    <p className='text-[rgb(85,85,85)] text-lg font-jostBook'>
                        The professional interests of our members, regulations & policies, laws, clinical professions community of practice and health service delivery
                    </p>
                </div>
            </div>
        </div>
        <div className='relative flex flex-col w-full h-auto space-y-8 px-[10%] py-16 shrink-0 bg-[rgb(238,238,238)]'>
            <div className='flex flex-row space-x-8'>
                <FaRegEye size={64} className='text-[rgb(85,85,85)] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Our version is to lead in enhancing the role and effectiveness of clinical officers in delivering 
                    quality healthcare services across Zambia
                </p>
            </div>
            <div className='flex flex-row space-x-8'>
                <TbTargetArrow size={64} className='text-[rgb(85,85,85)] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    The primary aim is to enhance the role and impact of clinical officers in Zambia’s healthcare system
                </p>
            </div>
            <div className='flex flex-row space-x-8'>
                <GiFlagObjective size={64} className='text-[rgb(85,85,85)] shrink-0'/>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Our mission is to advocate for and empower clinical officers to achieve excellence in healthcare service delivery 
                    through advocacy, capacity building, and collaboration with stakeholders
                </p>
            </div>
            <div className='flex flex-row space-x-8'>
                <FaListCheck size={64} className='text-[rgb(85,85,85)] shrink-0'/>
                <div className='flex flex-col space-y-2'>
                    <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                        Objectives of COAZ
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            To strengthen the capacity and capability of clinical officers through continuous 
                            professional development, education, and training
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            To strengthen influence in healthcare policymaking
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            To improve awareness of the role of clinical officers and healthcare service delivery
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            To conduct research for human health in priority areas and strengthen evidence-based 
                            practice among clinical practitioners
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            To collaborate with similar associations, organizations or allied professionals and 
                            establishments in Zambia, neighboring countries, the commonwealth and other countries in the 
                            world for the attainment of these objectives
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <GoDotFill size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            To collaborate with professional regulatory councils in maintaining the standards of the 
                            professional conduct, code of ethics and enforce their application by all members for the dignity of 
                            the profession
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div className='relative flex flex-col w-full h-auto pt-24 shrink-0 bg-white'>
          <div className='flex h-24 mx-auto shrink-0 border-l border-[rgb(204,204,204)]'></div>
          <p className='flex w-auto h-auto mx-auto pt-12 text-[rgb(150,150,150)] text-[15px] font-[arial]'>
              MEET THE EXECUTIVES
          </p>
          <p style={{fontSize:42+'px',lineHeight:52+'px'}} className='text-center w-auto h-auto px-8 mx-auto pt-2 text-[rgb(50,50,50)] font-leBeauneNew'>
              OUR EXPERT TEAM
          </p>
          <Executives/>
      </div>
    </div>
  )
}

export default About

const Executives = () => {
    const  executives = [];

    let president = findPerson('president');
    president && executives.push(president);

    let secretaryGeneral = findPerson('secretary general');
    secretaryGeneral && executives.push(secretaryGeneral);

    let deputySecretaryGeneral = findPerson('deputy secretary general');
    deputySecretaryGeneral && executives.push(deputySecretaryGeneral);

    let treasurer = findPerson('national treasurer');
    treasurer && executives.push(treasurer);

    let nationalPublicitySecretary = findPerson('national publicity secretary');
    nationalPublicitySecretary && executives.push(nationalPublicitySecretary);

    let deputyNationalPublicity = findPerson('deputy national publicity');
    deputyNationalPublicity && executives.push(deputyNationalPublicity);

    const executivesRef = useRef(null);
    const [columns,setColumns] = useState(executives? executives.length:0);
    const [itemSize,setItemSize] = useState({});
    const [space,setSpace] = useState(0);
  
    const calWidth = (pw,iw,cols) => {
        if(cols === 0){
          return {sp:0,cols:0};
        }
        let sp = 0;
        let asp = pw - (iw * cols);
        sp = asp/(cols + 1);
        if(sp < 1 && cols > 1) {
            cols -= 1;
            return calWidth(pw,iw,cols)
        } else {
          return {sp,cols};
        }
    }
  
    useEffect(() => {
        let itemWidth = 240;
        if(executivesRef.current) {
            let parentWidth = executivesRef.current.getBoundingClientRect().width;
            let {sp,cols} = calWidth(parentWidth,itemWidth,columns); 
            let h = (itemWidth*6)/5;
            setItemSize({width:itemWidth,height:h});
            setSpace(sp);
            setColumns(cols);
        }
    },[]);
  
    return (
      <div ref={executivesRef}  
          style={{'--space':space+'px'}}
          className={'flex flex-col space-y-(--space) w-full h-auto p px-(--space) py-24'}>
          {executives && (
            (() => {
                const rows = [];
                let rowKey = 0;
                for (let i = 0; i < executives.length;) {
                  const row = [];
                  for (let j = 0; j < columns; j++) {
                      if(i < executives.length) {
                          row.push(<Executive key={i} executive={executives[i]} size={itemSize}/>);
                          i++;
                      } else {
                          break;
                      }
                  }
                  rows.push(<div key={rowKey} style={{'--space':space+'px'}} className='flex flex-row w-auto h-auto shrink-0 space-x-(--space)'>{row}</div>);
                  rowKey++;
                }
                return rows;
            })()
          )}
      </div>
    )
  }
  
  const Executive = ({executive,size}) => {
    const {setDialog} = useContext(GlobalContext);
    return (executive &&
        <div style={{width:size.width+'px'}} 
            onClick={(e) => setDialog({
                show:true,
                Component: () => <Person person={executive}/>
            })}
            className='flex flex-col h-auto shrink-0 cursor-pointer'>
            <img src={executive.image?executive.image:executive.gender == 'male'?'/images/male.svg':'/images/female.svg'} alt={size.width+'x'+size.height}
                style={{width:size.width+'px',height:size.height+'px'}}
                className='flex object-cover shadow-xl rounded-md'
            />
            <div className='flex flex-col items-center justify-center w-full h-auto pt-8 space-y-2'>
                <p className='flex w-auto h-auto text-[22px] text-[rgb(59,59,59)] font-semibold font-leBeauneNew'>
                    {executive.name}
                </p>
                <p className='flex w-auto text-lg text-[rgb(100,100,100)] font-[arial] capitalize'>
                {executive.position}
                </p>
            </div>
        </div>
    )
  }