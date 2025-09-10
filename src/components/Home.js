"use client"
import MainSlide from './MainSlide';
import React, {useEffect, useRef, useState} from 'react';
import {
    CICollaboration,
    CIHandShake,
    CISearchEngine,
    CIAnalysis,
    CIPortal,
    CIMedicalInsurance,
    CITrophy,
    CISuccess,
    CISearch,
    CIResources
} from './CoazIcons';
import Button from '../components/Button'
import {MdSubdirectoryArrowRight} from 'react-icons/md';
import {news} from '../data'
import {IoIosArrowRoundForward} from 'react-icons/io';
import ChatBot from '../components/ChatBot';
const scrollCallbacks = [];

const Home = () => {
    useEffect(() => {
        window.addEventListener('scroll', function (event) {
            for (let callback of scrollCallbacks) {
                if (callback) {
                    callback(event);
                }
            }
        });
    }, [])

    return (
        <>
            <section>
                <ChatBot/>
            </section>
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
        </>
    )
}

export default Home


const Features = () => {

    return (
        <div
            className='relative flex flex-col md:flex-row w-full space-y-8 md:space-y-0 md:space-x-8 h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] py-16'>
            <div className='flex flex-col w-full md:w-[60%] h-fit space-y-12'>
                <div className='flex flex-col w-full h-fit space-y-8'>
                    <p className='font-nunitoSansBold text-[32px] text-heading'>Our Main Features</p>
                    <p className='w-full h-fit text-gray font-nunitoSansRegular'>
                    </p>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 w-full h-fit gap-8 overflow-hidden'>
                    <Feature
                        Icon={CICollaboration}
                        title='Organization'
                        description=''
                        active={true}
                    />
                    <Feature
                        Icon={CISearchEngine}
                        title='Marketing Strategy'
                        description=''
                    />
                    <Feature
                        Icon={CIAnalysis}
                        title='Risk Analysis'
                        description=''
                    />
                    <Feature
                        Icon={CIHandShake}
                        title='Capital Market'
                        description=''
                    />

                </div>
            </div>
            <SuccessStory
                paragraphs={[
                    ``,
                    ``
                ]}
            />
        </div>
    )
}


const Feature = ({Icon, title, description, active}) => {
    const [highlighted, setHighlighted] = useState(false);

    return (
        <div className='w-full h-64'>
            <div
                onMouseEnter={() => setHighlighted(true)}
                onMouseLeave={() => setHighlighted(false)}
                className={`feature ${active ? 'active' : ''} flex flex-col space-y-2 items-center p-[10%] hover:text-white overflow-hidden`}>
                {Icon && <div className='flex shrink-0'><Icon size={48}
                                                              fill={active || highlighted ? 'white' : 'rgb(27,156,227)'}/>
                </div>}
                {title &&
                <p style={{transition: 'color .4s ease-in-out'}}
                   className={`text-[20px] text-center font-nunitoSansBold ${active || highlighted ? 'text-white' : 'text-heading'}`}>
                    {title}
                </p>}
                {description &&
                <p style={{transition: 'color .4s ease-in-out'}}
                   className={`w-full h-full font-nunitoSansRegular ${active || highlighted ? 'text-[rgb(255,255,255,.9)]' : 'text-gray'} text-center overflow-hidden`}>
                    {description}
                </p>}
            </div>
        </div>
    )
}

const SuccessStory = ({paragraphs}) => {
    return (
        <div
            className='flex flex-col w-full md:w-[40%] h-fit space-y-4 shadow-[inset_0_0_0_4px_rgb(209,235,249)] p-6 overflow-hidden'>
            <img src='/images/img_15.jpg' className='w-full'/>
            <p className='font-nunitoSansBold text-[20px] text-heading'>Read Our Success Story for Inspiration</p>
            {paragraphs && paragraphs.length > 0 &&
            paragraphs.map((paragraph, i) =>
                <p key={i} className='w-full h-fit text-[16px]/[28px] text-gray font-nunitoSansRegular'>
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

    const [registeredMembers, setRegisteredMembers] = useState(null);
    const [activeMembers, setActiveMembers] = useState(null);
    const [activeDistricts, setActiveDistricts] = useState(null);

    useEffect(() => {
        scrollCallbacks.push(() => {
            if (statisticsRef && statisticsRef.current) {
                let top = Math.round(statisticsRef.current.getBoundingClientRect().top);
                if (top < window.innerHeight) {
                    let titles = statisticsRef.current.getElementsByClassName('title');
                    for (let title of titles) {
                        title.classList.remove('translate-y-full');
                    }
                }
            }
        });
        // Registered Members
        fetch("https://coaz.org:8085/coaz/api/user/count")
            .then(res => res.text())
            .then(text => setRegisteredMembers(parseInt(text)))
            .catch(err => console.error("Error fetching registered members:", err));

        // Active Members
        fetch("https://coaz.org:8085/coaz/api/user/count/active")
            .then(res => res.text())
            .then(text => setActiveMembers(parseInt(text)))
            .catch(err => console.error("Error fetching active members:", err));

        // Active Districts
        fetch("https://coaz.org:8085/coaz/api/district/count")
            .then(res => res.text())
            .then(text => setActiveDistricts(parseInt(text)))
            .catch(err => console.error("Error fetching active districts:", err));
    }, []);

    return (
        <div className='flex flex-col w-full h-fit'>
            <div ref={statisticsRef} style={{ backgroundImage: 'url(/images/img_18.jpg)' }}
                 className='relative flex flex-col w-full h-[160px] xs:h-[177.59px] md:h-[184.8px] items-center px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] bg-center bg-cover overflow-hidden shrink-0'>
                <div style={{ background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)', opacity: '.8' }}
                     className="absolute left-0 top-0 w-full h-full"/>
                <div className='w-full h-full z-10 overflow-hidden'>
                    <p style={{ transition: 'all 1s ease-in-out' }}
                       className='flex title w-full h-full justify-center items-center text-center text-[28px] md:text-[34px] text-white font-nunitoSansBold translate-y-full'>
                        Visit Our Statistics </p>
                </div>
                <div className='hidden xs:block w-full h-[52px] shrink-0'/>
            </div>
            <div className='w-full h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%]'>
                <div
                    className='flex w-full h-fit md:h-[157.2px] px-8 pt-8 pb-12 md:pt-0 md:py-0 z-10 items-center bg-white shadow-lg shadow-gray-200 xs:-translate-y-[52px] shrink-0'>
                    <div
                        className='flex flex-col md:flex-row space-y-6 md:space-y-0 md:justify-between w-full h-fit overflow-hidden'>

                        <Statistic statistic={activeMembers} text='ACTIVE MEMBERS'/>
                        <Statistic statistic={registeredMembers} text='REGISTERED MEMBERS'/>
                        <Statistic statistic={activeDistricts} text='ACTIVE DISTRICTS'/>
                        <Statistic statistic={10} text='OUR PARTNERS'/>

                    </div>
                </div>
            </div>
        </div>
    );
};
const Statistic = ({ statistic, text }) => {
    const [startCounter, setStartCounter] = useState(false);
    const statisticRef = useRef(null);

    useEffect(() => {
        scrollCallbacks.push(() => {
            if (statisticRef && statisticRef.current) {
                let top = Math.round(statisticRef.current.getBoundingClientRect().top);
                if (top < window.innerHeight) {
                    setStartCounter(true);
                    let statistics = statisticRef.current.getElementsByClassName('statistic');
                    for (let s of statistics) {
                        s.classList.remove('translate-y-full');
                    }
                }
            }
        });
    }, []);

    return (
        <div ref={statisticRef} className='w-fit h-fit overflow-hidden'>
            <div style={{ transition: 'all 1s ease-in-out' }}
                 className='statistic flex flex-col translate-y-full'>
                <div
                    className='relative flex items-center h-[72px] after:absolute after:bottom-[5px] after:left-0 after:w-[35px] after:h-0.5 after:bg-theme'>
                    <p className='font-nunitoSansSemiBold text-[40px]/[40px]'>
                        {startCounter ? statistic : 0}
                    </p>
                </div>
                <p className='font-nunitoSansextraBold text-sm text-[rgba(0,0,0,.8)] tracking-[1px]'>
                    {text}
                </p>
            </div>
        </div>
    );
};

const Services = () => {
    return (
        <div className='flex flex-col w-full h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] space-y-12'>
            <div className='flex flex-col w-full items-center space-y-6'>
                <p className='text-heading text-center text-[34px] font-nunitoSansBold'>Our Services</p>
                <p className='w-full sm:w-[450px] md:w-[610px] px-4 lg:w-[730px] text-[16px]/[28px] text-gray text-center font-nunitoSansRegular'>

                </p>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 overflow-hidden'>
                <Service
                    Icon={CIPortal}
                    title='CPD Platform'
                    description='Our Learning Platform For Our Members'

                />
                <Service
                    Icon={CIMedicalInsurance}
                    title='Health Insurance'
                    description='Protecting Your Health, Securing Your Future.'
                />
                <Service
                    Icon={CITrophy}
                    title='Awards & Certificates'
                    description='To honor outstanding contributions in Healthcare '
                />
                <Service
                    Icon={CIResources}
                    title='Resource Banking'
                    description=''
                />
                <Service
                    Icon={CISearch}
                    title='Research & Innovation Hub'
                    description='Advancing Evidence-Based Healthcare in Zambia '
                />
                <Service
                    Icon={CISuccess}
                    title='Careers'
                    description=''
                />
            </div>
        </div>
    )
}

const Service = ({Icon, title, description}) => {
    const [highlighted, setHighlighted] = useState(false);
    return (
        <div style={{transition: 'all .2s linear'}}
             onMouseEnter={() => setHighlighted(true)}
             onMouseLeave={() => setHighlighted(false)}
             className='relative grid-item flex flex-col w-full h-64 lg:h-74 space-y-2 items-center p-8 hover:bg-theme cursor-pointer'>
            {Icon &&
            <div className='flex mb-4 shrink-0'><Icon size={48} fill={highlighted ? 'white' : 'rgb(27,156,227)'}/>
            </div>}
            {title &&
            <p style={{transition: 'color .4s ease-in-out'}}
               className={`text-[20px] text-center font-nunitoSansBold ${highlighted ? 'text-white' : 'text-heading'}`}>
                {title}
            </p>
            }
            {description &&
            <p style={{transition: 'color .4s ease-in-out'}}
               className={`w-full h-full text-[16px]/[28px] ${highlighted ? 'text-[rgb(255,255,255,.9)]' : 'text-gray'} font-nunitoSansRegular text-center overflow-hidden`}>
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
            if (contactUsRef && contactUsRef.current) {
                let top = Math.round(contactUsRef.current.getBoundingClientRect().top);
                if (top < window.innerHeight) {
                    let titles = contactUsRef.current.getElementsByClassName('slide-in');
                    for (let title of titles) {
                        title.classList.remove('translate-y-full');
                    }
                }
            }
        })
    }, [])
    return (
        <div ref={contactUsRef} style={{backgroundImage: 'url(/images/img_55.jpg)'}}
             className='relative flex flex-col w-full h-[202px] md:h-[154px] items-center px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] bg-center bg-cover overflow-hidden shrink-0'>
            <div style={{background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)', opacity: '.8'}}
                 className="absolute left-0 top-0 w-full h-full"/>
            <div style={{transition: 'all 1s ease-in-out'}}
                 className='slide-in flex flex-col md:flex-row w-full h-full justify-center md:justify-between py-4 space-y-3 md:space-y-0 md:space-x-8 items-center z-10 translate-y-full overflow-hidden'>
                <p className='flex w-fit justify-center items-center text-[28px]/[40px] md:text-[34px] text-white font-nunitoSansBold'>
                    Visit Our Statistics </p>
                <button style={{transition: 'all .5s ease-in-out'}}
                        onClick={() => {
                        }}
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
                <p className='text-heading text-center text-[34px] font-nunitoSansBold'>Our Membership Benefits</p>
                <p className='w-full sm:w-[450px] md:w-[610px] px-4 lg:w-[730px] text-[16px]/[28px] text-gray text-center font-nunitoSansRegular'>
                </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                <Benefit img='/images/img_67.png'
                         bgColor='bg-gradient-to-t from-[rgb(27,156,227,.9)] to-[rgb(27,156,227,.7)]'
                         text='High Quality Lab Coats Distribution'/>
                <Benefit img='/images/img_56.png' bgColor='bg-[rgb(234,229,221)]' text='Advocacy & Representation'/>
                <Benefit img='/images/img_65.png' bgColor='bg-gradient-to-t from-[rgb(201,130,1)] to-[rgb(254,187,1)]'
                         text='Legal Representation'/>
                <Benefit img='/images/img_62.png'
                         bgColor='bg-gradient-to-b from-[rgb(234,229,221,.8)] to-[rgb(234,229,221,.2)]'
                         text='Continuing Professional Development'/>
                <Benefit img='/images/img_58.png'
                         bgColor='bg-gradient-to-b from-[rgb(234,229,221,.8)] to-[rgb(234,229,221,.2)]'
                         text='Loan & Financial Services'/>
                <Benefit img='/images/img_57.png' bgColor='bg-gradient-to-b from-[rgb(35,35,33)] to-[rgb(118,126,133)]'
                         text='Recognition & Awards'/>
                <Benefit img='/images/img_59.png' bgColor='h-64 bg-[rgb(245,245,245)]' text='Networking Opportunities'/>
                <Benefit img='/images/img_60.png'
                         bgColor='bg-gradient-to-b from-[rgb(226,205,149,.8)] to-[rgb(rgb(226,205,149,.7)]'
                         text='Mentorship Programs'/>
            </div>
        </div>
    )
}

const Benefit = ({img, bgColor, text}) => {
    const [highlighted, setHighlighted] = useState(false);
    return (
        <div className={`w-full h-[300px] ${bgColor}`}>
            <div style={{backgroundImage: `url(${img})`}}
                 className={`relative w-full h-full bg-center bg-contain bg-no-repeat`}>
                <div style={{transition: 'all .3s ease-in-out'}}
                     className={`absolute left-0 top-0 w-full h-full bg-theme ${highlighted ? 'opacity-90' : 'md:opacity-0 opacity-40'}`}/>
                <div onMouseEnter={() => setHighlighted(true)}
                     onMouseLeave={() => setHighlighted(false)}
                     className='absolute flex left-0 top-0 w-full h-full items-center justify-center'>
                    <div style={{transition: 'all .3s ease-in-out'}}
                         className={`flex flex-col p-6 space-y-4 items-center justify-center ${highlighted ? 'opacity-100' : 'md:opacity-0 opacity-100'}`}>
                        <p className='w-full h-fit text-[28px]/[40px] text-white font-nunitoSansSemiBold text-center cursor-pointer'>
                            {text}
                        </p>
                        <p className='w-full h-fit text-center text-[12px] text-white tracking-[2px] font-nunitoSansSemiBold'>PAID
                            MEMBERS ONLY</p>
                        <button style={{transition: 'all .3s ease-in-out'}}
                                className={`absolute flex items-center justify-center w-[50px] h-[50px] right-0 bottom-0 bg-white hover:bg-theme cursor-pointer ${highlighted ? 'opacity-100' : 'opacity-0'}`}>
                            <MdSubdirectoryArrowRight size={18}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const News = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // AGM Countdown Logic
    useEffect(() => {
        const calculateTimeLeft = () => {
            const currentDate = new Date();
            const agmDate = new Date(currentDate.getFullYear(), 9, 20); // October is month 9

            // If AGM date has passed this year, use next year
            if (agmDate < currentDate) {
                agmDate.setFullYear(agmDate.getFullYear() + 1);
            }

            const difference = agmDate.getTime() - currentDate.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({days, hours, minutes, seconds});
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    const latestNews = [];
    let sortedNews = news.sort((day1, day2) => (day1.date < day2.date) ? 1 : (day1.date > day2.date) ? -1 : 0);

    for (let i = 0; i < 3; i++) {
        if (i < sortedNews.length) {
            latestNews.push(sortedNews[i]);
        } else {
            break;
        }
    }

    return (
        <div
            className='relative flex flex-col w-full h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] space-y-12 font-nunito'>
            <div className='flex flex-col w-full items-center space-y-6'>
                <p className='text-heading text-center text-[34px] font-bold'>
                    Our Latest News : Annual General Meeting
                </p>
            </div>
            <div
                className='relative flex flex-col w-full h-fit px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] space-y-12 font-nunito'>
                <div className='flex flex-col w-full items-center space-y-6'>
                    <p className='text-heading text-center text-[34px] font-bold'>
                        AGM COUNTDOWN!
                    </p>
                    <div className="flex space-x-4 text-xl font-bold">
                        <div className="bg-blue-100 px-3 py-2 rounded-md">
                            <span>{timeLeft.days}</span>
                            <span className="block text-sm">Days</span>
                        </div>
                        <div className="bg-green-100 px-3 py-2 rounded-md">
                            <span>{timeLeft.hours}</span>
                            <span className="block text-sm">Hours</span>
                        </div>
                        <div className="bg-yellow-100 px-3 py-2 rounded-md">
                            <span>{timeLeft.minutes}</span>
                            <span className="block text-sm">Minutes</span>
                        </div>
                        <div className="bg-red-100 px-3 py-2 rounded-md">
                            <span>{timeLeft.seconds}</span>
                            <span className="block text-sm">Seconds</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                        {latestNews.map((newsItem, index) => (
                            <NewsItem key={index} newsItem={newsItem}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsItem = ({newsItem}) => {
    if (newsItem) {
        return (
            <div className='flex flex-col w-full h-fit border-4 border-[rgb(209,235,249)]'>
                <div style={{backgroundImage: newsItem.image ? `url(${newsItem.image})` : ''}}
                     className='relative flex w-full h-[275px] bg-cover bg-center'>
                    {newsItem.date && newsItem.date instanceof Date && !isNaN(newsItem.date) &&
                    <div
                        className='absolute flex flex-col left-0 bottom-0 w-[47.2] h-[98.8] bg-theme text-white items-center justify-between p-2'>
                        <span className='text-[20px] font-nunitoSansBold'>{newsItem.date.getDate()}</span>
                        <span
                            className='text-[13px] font-nunitoSansmedium'>{newsItem.date.toLocaleString('default', {month: 'long'})}</span>
                        <span className='text-[13px] font-nunitoSansmedium'>{newsItem.date.getFullYear()}</span>
                    </div>
                    }
                </div>
                <div className='flex flex-col w-full h-[300px] p-6 justify-between'>
                    <div className='flex flex-col w-full h-fit space-y-6'>
                        <p style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '2'}}
                           className='text-[20px] font-nunitoSansRegular overflow-hidden text-ellipsis'>
                            {newsItem.heading}
                        </p>
                        <p style={{display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '4'}}
                           className='text-gray font-nunitoSansRegular overflow-hidden text-ellipsis'>
                            {newsItem.content}
                        </p>
                    </div>
                    <div className='flex flex-row w-full'>
                        <button style={{transition: 'all .2s ease-in-out'}}
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
