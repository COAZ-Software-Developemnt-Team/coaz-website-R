"use client"
import MainSlide from './MainSlide';
import { useEffect, useRef, useState } from 'react';
import { CICollaboration,CIHandShake,CISearchEngine,CIAnalysis,CIPortal,CIMedicalInsurance,CITrophy,CISuccess,CISearch, CIResources } from './CoazIcons';
import Button from '../components/Button'
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import { sex,news } from '../data'
import { IoIosArrowRoundForward } from 'react-icons/io';

const scrollCallbacks = [];

const Home = () => {
  useEffect(() => {
    window.addEventListener('scroll', function(event) {
      for(let callback of scrollCallbacks) {
        if(callback) {
          callback(event);
        }
      }
    });
  },[])

  return (
    <>
      <section>
        <div className='relative flex flex-col w-full h-auto bg-[rgb(243,244,245)]'>
          <MainSlide/>
        </div>
      </section>
      <section className='py-[112px]'>
        <News/>
      </section>
      <section>
        <Features/>
      </section>
      <section>
        <Statistics/>
      </section>
      <section className='pt-[112px]'>
        <Services/>
      </section>
      <section className='pt-[112px]'>
        <ContactUs/>
      </section>
      <section className='pt-[112px]'>
        <MemberBenefits/>
      </section>
      <section>
        <Register/>
      </section>
    </>
  )
}

export default Home

const Features = () => {

  return (
    <div className='relative flex flex-col md:flex-row w-full space-y-8 md:space-y-0 md:space-x-8 h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] py-16'>
      <div className='flex flex-col w-full md:w-[60%] h-fit space-y-12'>
        <div className='flex flex-col w-full h-fit space-y-8'>
          <p className='font-nunitoSansBold text-[32px] text-heading'>Our Main Features</p>
          <p className='w-full h-fit text-gray font-nunitoSansRegular'>
            On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word.
          </p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 w-full h-fit gap-8 overflow-hidden'>
          <Feature 
            Icon={CICollaboration}
            title='Organization' 
            description='Far far away, behind the word mountains, far from the countries Vokalia.' 
            active={true}
          />
          <Feature
            Icon={CISearchEngine}
            title='Marketing Strategy' 
            description='Far far away, behind the word mountains, far from the countries Vokalia.' 
          />
          <Feature
            Icon={CIAnalysis}
            title='Risk Analysis' 
            description='Far far away, behind the word mountains, far from the countries Vokalia.' 
          />
          <Feature
            Icon={CIHandShake}
            title='Capital Market' 
            description='Far far away, behind the word mountains, far from the countries Vokalia.' 
          />
        </div>
      </div>
      <SuccessStory 
        paragraphs={[
          `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. 
          Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.`,
          `On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been 
          rewritten a thousand times and everything that was left from its origin would be the word.`
        ]}
      />
    </div>
  )
}


const Feature = ({Icon,title,description,active}) => {
    const [highlighted,setHighlighted] = useState(false); 

  return (
    <div className='w-full h-64'>
      <div 
        onMouseEnter={() => setHighlighted(true)}
        onMouseLeave={() => setHighlighted(false)}
        className={`feature ${active?'active':''} flex flex-col space-y-2 items-center p-[10%] hover:text-white overflow-hidden`}>
        {Icon && <div className='flex shrink-0'><Icon size={48} fill={active || highlighted?'white':'rgb(27,156,227)'}/></div>}
        {title && 
          <p style={{transition:'color .4s ease-in-out'}} 
            className={`text-[20px] text-center font-nunitoSansBold ${active || highlighted?'text-white':'text-heading'}`}>
            {title}
          </p>}
        {description && 
          <p style={{transition:'color .4s ease-in-out'}}
            className={`w-full h-full font-nunitoSansRegular ${active  || highlighted?'text-[rgb(255,255,255,.9)]':'text-gray'} text-center overflow-hidden`}>
            {description}
          </p>}
      </div>
    </div>
  )
}

const SuccessStory = ({paragraphs}) => {
  return (
    <div className='flex flex-col w-full md:w-[40%] h-fit space-y-4 shadow-[inset_0_0_0_4px_rgb(209,235,249)] p-6 overflow-hidden'>
        <img src='/images/img_15.jpg' className='w-full'/>
        <p className='font-nunitoSansBold text-[20px] text-heading'>Read Our Success Story for Inspiration</p>
        {paragraphs && paragraphs.length > 0 &&
          paragraphs.map((paragraph,i) => 
            <p key={i} className='w-full h-fit text-[16px]/[28px] text-gray font-nunitoSansRegular' >
              {paragraph}
            </p>
          )
        }
        <Button text='Contact us'/>
    </div>
  )
}

const Statistics = () => {
  const statisticsRef = useRef(null);

  useEffect(() => {
    scrollCallbacks.push(() => {
      if(statisticsRef && statisticsRef.current) {
        let top = Math.round( statisticsRef.current.getBoundingClientRect().top );
        if(top < window.innerHeight) {
          let titles = statisticsRef.current.getElementsByClassName('title');
          for(let title of titles) {
            title.classList.remove('translate-y-full');;
          }
        } 
      }
    })
  },[])
  return (
    <div className='flex flex-col w-full h-fit'>
      <div ref={statisticsRef} style={{backgroundImage:'url(/images/img_18.jpg)'}} 
        className='relative flex flex-col w-full h-[160px] xs:h-[177.59px] md:h-[184.8px] items-center px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] bg-center bg-cover overflow-hidden shrink-0'>
        <div style={{background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)',opacity: '.8'}} className="absolute left-0 top-0 w-full h-full"/>
        <div className='w-full h-full z-10 overflow-hidden'>
          <p style={{transition:'all 1s ease-in-out'}}
            className='flex title w-full h-full justify-center items-center text-center text-[28px] md:text-[34px] text-white font-nunitoSansBold translate-y-full'>
            You Always Get the Best Guidance
          </p>
        </div>
        <div className='hidden xs:block w-full h-[52px] shrink-0'/>
      </div>
      <div className='w-full h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%]'>
        <div className={`flex w-full h-fit md:h-[157.2px] px-8 pt-8 pb-12 md:pt-0 md:py-0 z-10 items-center bg-white shadow-lg shadow-gray-200 xs:-translate-y-[52px] shrink-0`}>
          <div className='flex flex-col md:flex-row space-y-6 md:space-y-0 md:justify-between w-full h-fit overflow-hidden'>
            <Statistic statistic='6000' text='REGISTERED MEMBERS'/>
            <Statistic statistic='116' text='ACTIVE DISTRICTS'/>
            <Statistic statistic='35' text='STAFF MEMBERS'/>
            <Statistic statistic='10' text='OUR PARTNERS'/>
          </div>
        </div>
      </div>
    </div>
    
  )
}

const Statistic = ({statistic,text}) => {
  const [startCounter,setStartCounter] = useState(false); 
  const statisticRef = useRef(null)
   useEffect(() => {
    scrollCallbacks.push(() => {
      if(statisticRef && statisticRef.current) {
        let top = Math.round( statisticRef.current.getBoundingClientRect().top );
        if(top < window.innerHeight) {
          setStartCounter(true);
          let statistics = statisticRef.current.getElementsByClassName('statistic');
          for(let statistic of statistics) {
            statistic.classList.remove('translate-y-full');
          }
        } 
      }
    })
   },[])
  return (
    <div ref={statisticRef} className='w-fit h-fit overflow-hidden'>
      <div style={{transition:'all 1s ease-in-out'}}
        className='statistic flex flex-col translate-y-full'>
        <div className='relative flex items-center h-[72px] after:absolute after:bottom-[5px] after:left-0 after:w-[35px] after:h-0.5 after:bg-theme'>
          <p style={{'--num':startCounter?statistic:0}} className='number font-nunitoSansSemiBold text-[40px]/[40px]'/>
        </div>
        <p className='font-nunitoSansextraBold text-sm text-[rgba(0,0,0,.8)] tracking-[1px]'>
          {text}
        </p>
      </div>
    </div>
  )
}

const Services = () => {
  return ( 
    <div className='flex flex-col w-full h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] space-y-12'>
      <div className='flex flex-col w-full items-center space-y-6'>
        <p className='text-heading text-center text-[34px] font-nunitoSansBold'>Our Best Services</p>
        <p className='w-full sm:w-[450px] md:w-[610px] px-4 lg:w-[730px] text-[16px]/[28px] text-gray text-center font-nunitoSansRegular'>
          Separated they live in. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country
        </p>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 overflow-hidden'>
        <Service 
          Icon={CIPortal}
          title='CPD Platform' 
          description='Far far away, behind the word mountains, far from the countries Vokalia.'
        />
        <Service 
          Icon={CIMedicalInsurance}
          title='Health Insurance' 
          description='Far far away, behind the word mountains, far from the countries Vokalia.'
        />
        <Service 
          Icon={CITrophy}
          title='Awards & Certificates'
          description='Far far away, behind the word mountains, far from the countries Vokalia.'
        />
        <Service 
          Icon={CIResources}
          title='Resource Banking' 
          description='Far far away, behind the word mountains, far from the countries Vokalia.'
        />
        <Service 
          Icon={CISearch}
          title='Research Publication' 
          description='Far far away, behind the word mountains, far from the countries Vokalia.'
        />
        <Service 
          Icon={CISuccess}
          title='Careers' 
          description='Far far away, behind the word mountains, far from the countries Vokalia.'
        />
      </div>
    </div>
  )
}

const Service = ({Icon,title,description}) => {
  const [highlighted,setHighlighted] = useState(false);
  return (
    <div style={{transition:'all .2s linear'}} 
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
     className='relative grid-item flex flex-col w-full h-64 lg:h-74 space-y-2 items-center p-8 hover:bg-theme cursor-pointer'>
      {Icon && <div className='flex mb-4 shrink-0'><Icon size={48} fill={highlighted?'white':'rgb(27,156,227)'}/></div>}
        {title && 
          <p style={{transition:'color .4s ease-in-out'}} 
            className={`text-[20px] text-center font-nunitoSansBold ${highlighted?'text-white':'text-heading'}`}>
            {title}
          </p>
        }
        {description && 
          <p style={{transition:'color .4s ease-in-out'}}
            className={`w-full h-full text-[16px]/[28px] ${highlighted?'text-[rgb(255,255,255,.9)]':'text-gray'} font-nunitoSansRegular text-center overflow-hidden`}>
            {description}
          </p>
        }
    </div>
  )
}

const ContactUs = () => {
  const contactUsRef = useRef(null);

  useEffect(() => {
    scrollCallbacks.push(() => {
      if(contactUsRef && contactUsRef.current) {
        let top = Math.round( contactUsRef.current.getBoundingClientRect().top );
        if(top < window.innerHeight) {
          let titles = contactUsRef.current.getElementsByClassName('slide-in');
          for(let title of titles) {
            title.classList.remove('translate-y-full');
          }
        } 
      }
    })
  },[])
  return (
    <div ref={contactUsRef}  style={{backgroundImage:'url(/images/img_55.jpg)'}} 
      className='relative flex flex-col w-full h-[202px] md:h-[154px] items-center px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] bg-center bg-cover overflow-hidden shrink-0'>
      <div style={{background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)',opacity: '.8'}} className="absolute left-0 top-0 w-full h-full"/>
      <div style={{transition:'all 1s ease-in-out'}}
        className='slide-in flex flex-col md:flex-row w-full h-full justify-center md:justify-between py-4 space-y-3 md:space-y-0 md:space-x-8 items-center z-10 translate-y-full overflow-hidden'>
        <p className='flex w-fit justify-center items-center text-[28px]/[40px] md:text-[34px] text-white font-nunitoSansBold'>
          You Always Get the Best Guidance
        </p>
        <button style={{transition:'all .5s ease-in-out'}} 
          onClick={() => {}} 
          className='w-full md:w-fit h-fit px-16 py-4 font-normal text-theme font-nunitoSansRegular bg-white rounded-full cursor-pointer shrink-0 text-nowrap'>
          Contact Us
        </button>
      </div>
    </div>
  )
}

const MemberBenefits = () => {
  return (
    <div className='flex flex-col w-full h-fit space-y-16'>
      <div className='flex flex-col w-full items-center space-y-6'>
        <p className='text-heading text-center text-[34px] font-nunitoSansBold'>Our Member Benefits</p>
        <p className='w-full sm:w-[450px] md:w-[610px] px-4 lg:w-[730px] text-[16px]/[28px] text-gray text-center font-nunitoSansRegular'>
          Separated they live in. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
        <Benefit img='/images/img_67.png' bgColor = 'bg-gradient-to-t from-[rgb(27,156,227,.9)] to-[rgb(27,156,227,.7)]' text='High Quality Lab Coats Distribution'/>
        <Benefit img='/images/img_56.png' bgColor = 'bg-[rgb(234,229,221)]' text='Advocacy & Representation'/>
        <Benefit img='/images/img_65.png' bgColor = 'bg-gradient-to-t from-[rgb(201,130,1)] to-[rgb(254,187,1)]' text='Legal Representation'/>
        <Benefit img='/images/img_62.png' bgColor = 'bg-gradient-to-b from-[rgb(234,229,221,.8)] to-[rgb(234,229,221,.2)]' text='Continuing Professional Development'/>
        <Benefit img='/images/img_58.png' bgColor = 'bg-gradient-to-b from-[rgb(234,229,221,.8)] to-[rgb(234,229,221,.2)]' text='Loan & Financial Services'/>
        <Benefit img='/images/img_57.png' bgColor = 'bg-gradient-to-b from-[rgb(35,35,33)] to-[rgb(118,126,133)]' text='Recognition & Awards'/>
        <Benefit img='/images/img_59.png' bgColor = 'h-64 bg-[rgb(245,245,245)]' text='Networking Opportunities'/>
        <Benefit img='/images/img_60.png' bgColor = 'bg-gradient-to-b from-[rgb(226,205,149,.8)] to-[rgb(rgb(226,205,149,.7)]' text='Mentorship Programs'/>
      </div>
    </div>
  )
}

const Benefit = ({img,bgColor,text}) => {
  const [highlighted,setHighlighted] = useState(false);
  return (
    <div className={`w-full h-[300px] ${bgColor}`}>
      <div style={{backgroundImage:`url(${img})`}} className={`relative w-full h-full bg-center bg-contain bg-no-repeat`}>
        <div style={{transition:'all .3s ease-in-out'}} className={`absolute left-0 top-0 w-full h-full bg-theme ${highlighted?'opacity-90':'md:opacity-0 opacity-40'}`}/> 
        <div onMouseEnter={() => setHighlighted(true)}
          onMouseLeave={() => setHighlighted(false)}
          className='absolute flex left-0 top-0 w-full h-full items-center justify-center'>
          <div style={{transition:'all .3s ease-in-out'}} className={`flex flex-col p-6 space-y-4 items-center justify-center ${highlighted?'opacity-100':'md:opacity-0 opacity-100'}`}>
            <p className='w-full h-fit text-[28px]/[40px] text-white font-nunitoSansSemiBold text-center cursor-pointer'>
              {text}
            </p>
            <p className='w-full h-fit text-center text-[12px] text-white tracking-[2px] font-nunitoSansSemiBold'>PAID MEMBERS ONLY</p>
            <button style={{transition:'all .3s ease-in-out'}}
              className={`absolute flex items-center justify-center w-[50px] h-[50px] right-0 bottom-0 bg-white hover:bg-theme cursor-pointer ${highlighted?'opacity-100':'opacity-0'}`}>
              <MdSubdirectoryArrowRight size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Register = () => {
  const registerRef = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    scrollCallbacks.push(() => {
      if(registerRef && registerRef.current) {
        const rect = registerRef.current.getBoundingClientRect();
        const top = Math.round(rect.top );
        const range = window.innerHeight + Math.round(rect.height);
        const view = window.innerHeight - top;
        if(view > 0 && view < range && imgRef.current) {
          let imgTop = ((view - window.innerHeight)/range)*100;
          imgRef.current.style.top = imgTop+'%'
        } 
      }
    })
  },[])
  return (
    <div ref={registerRef} className='relative flex w-full h-fit mb-32 overflow-hidden'>
      <div ref={imgRef} className='absolute flex left-0 w-full h-[112vh] -z-10 bg-[url(/public/images/img_46.jpg)] bg-cover bg-center'/>
      <div style={{background: 'linear-gradient(to right, rgba(21,102,173,.8) 0%, rgba(27,157,227,.8) 100%)'}} 
        className='flex flex-row-reverse w-full h-fit py-12 lg:py-24 px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%]'>
        <div className='flex flex-col w-full md:w-1/2 h-full justify-center space-y-6 overflow-hidden'>
          <div className='flex flex-col w-full h-fit space-y-6'>
            <h1 className='text-[34px] text-white font-nunitoSansBold'>
              Register with Us
            </h1>
            <p className='text-[rgba(255,255,255,.9)] font-nunitoSansRegular'>
              Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
            </p>
          </div>
          <Form/>
        </div>
      </div>
    </div>
  )
}

const Form = () => {
  const [user,setUser] = useState({});
  const userTypes = [{id:1,name:'Full Membership'},{id:2,name:'Associate Membership'},{id:3,name:'Student Membership'}];
  const onChange = (e) => {
      const value = e.target.value;
      if(value === '') {
          setUser({...user, [e.target.name]: null});
      } else {
          setUser({...user, [e.target.name]: value});
      }
  };
  const onUserType = (e) => {
      const value = e.target.value;
      if(value === '') {
        setUser({...user,userType:null});
        return
      }
      const userType = userTypes.find((userType) => {return userType.id == value});
      if(userType) {
          setUser({...user,userType:userType});
      }
  };
  return (
    <div id="user-form" className='grid grid-cols-1 md:grid-cols-2 w-full h-fit gap-4'>
      <Input type='text' name='firstName' value={user.firstName?user.firstName:''} placeholder='First Name' onChange={onChange}/>
      <Input type='text' name='lastName' value={user.lastName?user.lastName:''} placeholder='Last Name' onChange={onChange}/>
      <Input type='text' name='email' value={user.email?user.email:''} placeholder='Email' onChange={onChange}/>
      <Input type='text' name='idNumber' value={user.idNumber?user.idNumber:''} placeholder='Id Number' onChange={onChange}/>
      <Input type='select' name='gender' value={user.gender?user.gender:''} options onChange={onChange}>
        <option value=''>gender</option>
        {sex.map((option,i) => <option key={i}>{option}</option>)}
      </Input>
      <Input type='select' name='userType' value={user.userType?user.userType.id:''} onChange={onUserType}>
        <option value=''>User Type</option>
        {userTypes.map((option,i) => <option key={i} value={option.id}>{option.name}</option>)}
      </Input>
      <Input type='password' name='password' value={user.password?user.password:''} placeholder='Password' onChange={onChange}/>
      <button onClick={() => {}} 
        className='w-full h-[58px] font-nunitoSansRegular text-theme bg-white rounded-full cursor-pointer shrink-0 text-nowrap'>
        Submit Form
      </button>
    </div>
  )
}

const Input = ({type,name,value,children,placeholder,onChange}) => {
  if(type === 'select') {
    return (
      <select
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className='w-full h-[58px] text-[rgba(255,255,255,.9)] font-nunitoSansRegular border-b border-[rgba(255,255,255,0.2)] focus:outline-hidden whitespace-nowrap bg-transparent'>
        {children}
      </select>
    )
  } else {
    return (
      <input 
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className='w-full h-[58px] text-[rgba(255,255,255,.9)] font-nunitoSansRegular placeholder:text-[rgba(255,255,255,.9)] border-b border-[rgba(255,255,255,0.2)] focus:outline-hidden whitespace-nowrap bg-transparent'/>
    )
  }
}

const News = () => {
  const latestNews = []

  let sortedNews = news.sort((day1,day2) => (day1.date < day2.date)?1:(day1.date > day2.date)?-1:0);

  for(let i = 0; i < 3; i++)  {
    if(i < sortedNews.length) {
      latestNews.push(sortedNews[i])
    } else {
      break;
    }
  }

  return (
    <div className='relative flex flex-col w-full h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] space-y-12'>
      <div className='flex flex-col w-full items-center space-y-6'>
        <p className='text-heading text-center text-[34px] font-nunitoSansBold'>
          Our Latest News
        </p>
        <p className='w-full sm:w-[450px] md:w-[610px] px-4 lg:w-[730px] font-nunitoSansRegular text-[16px]/[28px] text-gray text-center'>
          Separated they live in. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {latestNews && latestNews.map((newsItem,i) => <NewsItem key={i} newsItem={newsItem}/>)}
      </div>
    </div>
  )
}

const NewsItem = ({newsItem}) => {
  if(newsItem) {
    return (
      <div className='flex flex-col w-full h-fit border-4 border-[rgb(209,235,249)]'>
        <div style={{backgroundImage:newsItem.image?`url(${newsItem.image})`:''}} className='relative flex w-full h-[275px] bg-cover bg-center'>
        {newsItem.date && newsItem.date instanceof Date && !isNaN(newsItem.date) &&
          <div className='absolute flex flex-col left-0 bottom-0 w-[47.2] h-[98.8] bg-theme text-white items-center justify-between p-2'>
            <span className='text-[20px] font-nunitoSansBold'>{newsItem.date.getDate()}</span>
            <span className='text-[13px] font-nunitoSansmedium'>{newsItem.date.toLocaleString('default', { month: 'long' })}</span>
            <span className='text-[13px] font-nunitoSansmedium'>{newsItem.date.getFullYear()}</span>
          </div>
        }
        </div>
        <div className='flex flex-col w-full h-[300px] p-6 justify-between'>
          <div className='flex flex-col w-full h-fit space-y-6'>
            <p style={{display:'-webkit-box', WebkitBoxOrient:'vertical',WebkitLineClamp:'2'}}
              className='text-[20px] font-nunitoSansRegular overflow-hidden text-ellipsis'>
              {newsItem.heading}
            </p>
            <p style={{display:'-webkit-box', WebkitBoxOrient:'vertical',WebkitLineClamp:'4'}} 
              className='text-gray font-nunitoSansRegular overflow-hidden text-ellipsis'>
              {newsItem.content}
            </p>
          </div>
          <div className='flex flex-row w-full'>
            <button style={{transition:'all .2s ease-in-out'}}
              className='flex flex-row w-fit h-fit px-[12px] py-[6px] items-center text-white font-nunitoSansRegular bg-theme rounded-full hover:shadow-[inset_0_0_0_1px_var(--color-theme)] hover:text-theme hover:bg-transparent cursor-pointer'>
              Read More<IoIosArrowRoundForward size={16}/>
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>

      </div>
    )
  }
}
