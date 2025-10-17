import React, {useContext, useEffect, useRef, useState} from 'react'
import {GlobalContext} from '../contexts/GlobalContext';
import {useLocation} from 'react-router-dom';
import {events, news} from '../data'
import {LiaClockSolid} from "react-icons/lia";
import {SlLocationPin} from "react-icons/sl";
import CMS from '../components/CMS'


const News = () => {
    const {mainElementRef} = useContext(GlobalContext);
    const [selected,setSelected] = useState(null);
    const [imgHeight,setImgHeight] = useState(null);
    const [hasRelated,setHasRelated] = useState(false);
    const selectedRef = useRef(null);
    const relatedRef = useRef(null);
    const {state} = useLocation();
    const item = state?state.item:null;

    const onSelect = (selected) => {
        setSelected(selected);
        if(mainElementRef.current && selectedRef.current) {
          let top = (selectedRef.current.getBoundingClientRect().top + mainElementRef.current.scrollTop) - 120;
          mainElementRef.current.scrollTo({top:top })
        }
    }
    
    useEffect(() => { 
        if(news && news.length > 0) {
            if(item) {
                let found = news.find((newsItem) => {return newsItem.heading == item});
                if(found){
                    onSelect(found)
                } else {
                    onSelect(news[0]);
                }
            } else {
                setSelected(news[0]);
            } 
        } 

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                let rect = entry.target.getBoundingClientRect();
                setImgHeight((rect.width * 9)/16);
            }
        });

        if(selectedRef.current) {
            observer.observe(selectedRef.current);
        }
        return () => {
            observer.disconnect();
        };
    },[item]);

    return (
        <div className='relative flex flex-col w-full h-auto'>
            <div className='relative flex flex-col w-full h-[40vh] shrink-0 overflow-x-hidden overflow-y-auto'>
                <img src='images/img_29.jpg' className='flex w-full h-full object-cover overflow-hidden'/>
                <div className='absolute flex  left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.8)] via-transparent to-[rgba(0,0,0,.8)]'/>
                <div className='absolute flex flex-col justify-end top-[166px] bottom-0 w-full px-[10%]'>
                    <div className='flex flex-col w-full space-y-4 items-center justify-center mb-8'>
                    </div>
                    <p className='text-white tracking-wide text-4xl lg:text-7xl font-leBeauneNew'> 
                        Latest Insights and news
                    </p>
                    <div className='flex w-[2px] h-16 border-r border-white'/>
                </div>
            </div>
            <div className='relative flex flex-col space-y-8 w-full h-auto px-[10%] pb-16 shrink-0 bg-[rgb(243,244,245)]'>
                <div className='flex w-[2px] h-24 border-l border-[rgb(204,204,204)]'/>
                {news && news.length > 0 && 
                  <div className='flex flex-col w-full h-auto'>
                      <div className='flex flex-col lg:flex-row lg:space-x-8 w-full h-auto'>
                        <div ref={selectedRef}
                          className={`flex flex-col w-full ${hasRelated?'lg:w-3/4':''} h-auto`}>
                            <img src={selected && selected.image?selected.image:''} 
                              style={{height:imgHeight+'px'}}
                              className='w-full object-cover'
                            />
                            <div  className='flex flex-col w-full h-auto py-8'>
                              <p className='text-sm text-[rgb(59,59,59)] font-jostSemi tracking-wide'>{selected && selected.date?selected.date:''}</p>
                              <p style={{display:'-webkit-box', WebkitBoxOrient:'vertical',WebkitLineClamp:'2'}} 
                                className='flex w-full h-auto pt-4 text-3xl font-semibold font-leBeauneNew overflow-hidden text-ellipsis'>
                                  {selected && selected.heading?selected.heading:''}
                              </p>
                              <p className='flex w-full h-fit pt-4 lg:text-lg text-[rgb(59,59,59)] font-jostBook overflow-hidden text-ellipsis'>
                                  {selected && selected.content?selected.content:''}
                              </p>
                            </div>
                        </div>
                        <div ref={relatedRef}
                          className={`flex flex-col ${hasRelated?'w-full lg:w-1/4 h-fit':'w-0 h-0'} lg:items-end overflow-hidden`}>
                            <Related selected={selected} onSelect={onSelect} relatedRef={relatedRef} setHasRelated={setHasRelated}/>
                        </div>
                      </div>
                      <More onSelect={onSelect}/>
                      <Events/>
                      <CMS/>
                  </div>

                }
            </div>
        </div>
      )
}

export default News

const Related = ({selected,onSelect,relatedRef,setHasRelated}) => {
    const [index,setIndex] = useState(0);
    const newsSliderRef = useRef(null);
    const [slideInfo,setSlideInfo] = useState({
      items:[],
      width:240,
      height:200,
      minWidth:240,
      minHeight:240,
      imgHeight:135,
      space:0,
      visible:0,
      horizontal:false}
    ); 
    const [sliderWidth,setSliderWidth] = useState(0);
    const [sliderHeight,setSliderHeight] = useState(0);

    const slide = (newIndex) => {
      if(newsSliderRef.current) {
          let slides = newsSliderRef.current.getElementsByClassName('news-slide');
          if(slides) {
              if(slideInfo.horizontal)  {
                let origin = 0;
                let left = origin - ((newIndex*slideInfo.width)+(newIndex*slideInfo.space));
                for (let i = 0;i < slides.length; i++) {
                  let slide = slides[i];
                  slide.style.left = left+'px';
                  left += slideInfo.width + slideInfo.space;
                }
              } else {
                let origin = 0;
                let top = origin - ((newIndex*slideInfo.height)+(newIndex*slideInfo.space));
                for (let i = 0;i < slides.length; i++) {
                  let slide = slides[i];
                  slide.style.top = top+'px';
                  top += slideInfo.height + slideInfo.space;
                }
              }
              
              setIndex(newIndex);
          }
      }
    }
    
    useEffect(() => { 
        if(selected) {
          slideInfo.items = news.filter(newsItem => (newsItem.tag === selected.tag && newsItem.heading !== selected.heading));
          setSlideInfo({...slideInfo});
          setHasRelated(slideInfo.items.length > 0);
        }
        let i = 0;
        const interval = setInterval((e) => {
            slide(i);
            i++
            if(i >= slideInfo.items.length - (slideInfo.visible - 1)) {
              i = 0;
            }
        },10000);

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                let rect = entry.target.getBoundingClientRect();
                slideInfo.space = slideInfo.items.length > 1?32:0;
                slideInfo.visible = slideInfo.items.length > 2?2:slideInfo.items.length;
                if(rect.width > slideInfo.space + (slideInfo.minWidth * slideInfo.visible)) {
                  slideInfo.width = (rect.width - slideInfo.space) / slideInfo.visible;
                  slideInfo.imgHeight = (slideInfo.width * 9)/16;
                  slideInfo.height = slideInfo.imgHeight + 180;
                  slideInfo.horizontal = true;
                  setSliderWidth(rect.width);
                  setSliderHeight(slideInfo.height);
                } else {
                  slideInfo.width = rect.width;
                  slideInfo.imgHeight = (slideInfo.width * 9)/16;
                  slideInfo.height = slideInfo.imgHeight + 180;
                  let height = (slideInfo.height * slideInfo.visible) + (slideInfo.space * (slideInfo.visible - 1));
                  slideInfo.horizontal = false;
                  setSliderWidth(slideInfo.width);
                  setSliderHeight(height);
                }
                setSlideInfo({...slideInfo});
                slide(0);
            }
        });

        if(relatedRef.current) {
            observer.observe(relatedRef.current);
        }
        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    },[selected]);
  return (
    <div className='flex flex-col w-auto h-auto space-y-8 items-center '>
        <p className='flex w-full pt-2 text-sm text-[rgb(59,59,59)] font-semibold font-jostSemi overflow-hidden text-ellipsis border-t border-[rgb(204,204,204)] uppercase'>
            Related Items
        </p>
        <div ref={newsSliderRef}
          style={{width:sliderWidth+'px',height:sliderHeight+'px'}}
          className='relative flex w-full h-full overflow-hidden'>
          {slideInfo.items && (slideInfo.items.map((newsItem,i) => 
            <div key={i} 
                style={{
                  width:slideInfo.width+'px',
                  height:slideInfo.height+'px',
                  transition:'all 1s ease-in-out'
                }} 
                onClick={(e) => onSelect(newsItem)}
                className='news-slide absolute flex flex-col space-y-4 overflow-hidden cursor-pointer'>
                <img 
                  src={newsItem.image}
                  style={{height:((9*slideInfo.width)/16)+'px'}} 
                  className='w-full object-cover shrink-0'
                />
                <p className='text-sm text-[rgb(59,59,59)] font-jostSemi tracking-wide'>{newsItem.date}</p>
                <p className='w-full h-auto text-xl font-bold font-leBeauneNew overflow-hidden'>
                    {newsItem.heading}
                </p>
                <p style={{display:'-webkit-box', WebkitBoxOrient:'vertical',WebkitLineClamp:'3'}} 
                  className='flex w-full h-auto text-[rgb(59,59,59)] font-jostBook overflow-hidden text-ellipsis'>
                    {newsItem.content}
                </p>
            </div>
            )
          )}
        </div>
    </div>
  )
}

const More = ({onSelect}) => {
    const [columns,setColumns] = useState(news? news.length:0);
    const [itemSize,setItemSize] = useState({});
    const moreRef = useRef(null);

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
              let minWidth = 256;
              let paddingX = 0;
              let spaceX = 32;
              let parentWidth = entry.target.getBoundingClientRect().width;
              let {w,cols} = calWidth(parentWidth,minWidth,paddingX,spaceX,columns); 
              let h = (449*w)/640;
              setItemSize({width:w,height:h});
              setColumns(cols);
          }
      });

      if(moreRef.current) {
          observer.observe(moreRef.current)
      }
      return () => {
          observer.disconnect();
      }
    },[]);
  return (
    <div className='flex flex-col w-full h-auto space-y-8 py-8'>
        <p className='flex w-full pt-2 text-sm text-[rgb(59,59,59)] font-semibold font-jostSemi overflow-hidden text-ellipsis border-t border-[rgb(204,204,204)] uppercase'>
            MORE
        </p>
        <div ref={moreRef}
            className='flex flex-col space-y-8 w-full h-auto mx-auto '>
            {(() => {
                const rows = [];
                let rowKey = 0;
                for (let i = 0; i < news.length;) {
                    const row = [];
                    for (let j = 0; j < columns; j++) {
                        if(i < news.length) {
                            row.push(<MoreItem key={i} newsItem={news[i]} size={itemSize} onSelect={onSelect}/>);
                            i++;
                        } else {
                            break;
                        }
                    }
                    rows.push(<div key={rowKey} className={`flex flex-row w-auto h-auto shrink-0 space-x-8`}>{row}</div>);
                    rowKey++;
                }
                return rows;
            })()}
        </div>
    </div>
  )
}

const MoreItem = ({newsItem,size,onSelect}) => {
  return (
      <div style={{width:size.width+'px'}}
          onClick={(e) => onSelect(newsItem)}
          className='flex flex-col space-y-4 h-auto overflow-hidden cursor-pointer'>
          <img 
            src={newsItem.image} 
            alt='img' 
            style={{height:((9*size.width)/16)+'px'}} 
            className='w-full h-auto object-cover'/>
            <p className='text-sm text-[rgb(59,59,59)] font-jostSemi tracking-wide'>{newsItem.date}</p>
            <p className='w-full h-auto text-xl font-bold font-leBeauneNew overflow-hidden'>
                {newsItem.heading}
            </p>
            <p style={{display:'-webkit-box', WebkitBoxOrient:'vertical',WebkitLineClamp:'3'}} 
              className='flex w-full h-auto text-[rgb(59,59,59)] font-jostBook overflow-hidden text-ellipsis'>
                {newsItem.content}
            </p>
      </div>
  )
}

const Events = ({}) => {
  const {mainElementRef} = useContext(GlobalContext);
  const [columns,setColumns] = useState(events? events.length:0);
  const [eventSize,setEventSize] = useState({});
  const eventsConteinerRef = useRef(null);
  const eventsRef = useRef(null);
  const {state} = useLocation();
  const allEvents = state && state.events;


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
          if(allEvents){
              if(mainElementRef.current) {
                let top = (entry.target.getBoundingClientRect().top + mainElementRef.current.scrollTop) - 120;
                mainElementRef.current.scrollTo({top:top })
              }
          } 
        }
    })
    const observer2 = new ResizeObserver(entries => {
        for (let entry of entries) {
            let minWidth = 256;
            let paddingX = 0;
            let spaceX = 32;
            let parentWidth = entry.target.getBoundingClientRect().width;
            let {w,cols} = calWidth(parentWidth,minWidth,paddingX,spaceX,columns); 
            let h = (449*w)/640;
            setEventSize({width:w,height:h});
            setColumns(cols);
        }
    });

    if(eventsConteinerRef.current) {
        observer.observe(eventsConteinerRef.current)
    }
    if(eventsRef.current) {
        observer2.observe(eventsRef.current)
    }
    return () => {
        observer.disconnect();
        observer2.disconnect();
    }
  },[]);
return (
  <div ref={eventsConteinerRef}
    className='flex flex-col w-full h-auto space-y-8 py-8'>
      <p className='flex w-full pt-2 text-sm text-[rgb(59,59,59)] font-semibold font-jostSemi overflow-hidden text-ellipsis border-t border-[rgb(204,204,204)] uppercase'>
          UPCOMING EVENTS
      </p>
      <div ref={eventsRef}
        className='flex flex-col space-y-8 w-full h-auto mx-auto '>
          {(() => {
              const rows = [];
              let rowKey = 0;
              for (let i = 0; i < events.length;) {
                  const row = [];
                  for (let j = 0; j < columns; j++) {
                      if(i < events.length) {
                          row.push(<Event key={i} event={events[i]} size={eventSize}/>);
                          i++;
                      } else {
                          break;
                      }
                  }
                  rows.push(<div key={rowKey} className={`flex flex-row w-auto h-auto shrink-0 space-x-8`}>{row}</div>);
                  rowKey++;
              }
              return rows;
          })()}
      </div>
  </div>
)
}

const Event = ({event,size}) => {
return (
    <div style={{width:size.width+'px'}}
        className='flex flex-col space-y-4 h-auto overflow-hidden'>
        <img 
          src={event.image} 
          alt='img' 
          style={{height:((9*size.width)/16)+'px'}} 
          className='w-full h-auto object-cover'
        />
        <p className='text-sm text-[rgb(59,59,59)] font-jostSemi tracking-wide'>{event.date}</p>
        <p style={{display:'-webkit-box', WebkitBoxOrient:'vertical',WebkitLineClamp:'2'}} 
            className='flex w-full h-16 pt-4 text-lg font-bold font-leBeauneNew overflow-hidden text-ellipsis'>
            {event.title}
        </p>
        <div className='flex flex-col space-y-2 w-auto h-auto'>
            <div className='flex flex-row space-x-2 items-center'>
              <LiaClockSolid size={16} className='text-[rgb(0,175,240)]'/>
              <p className='text-xs text-[rgb(0,175,240)] font-jostSemi'>{event.start+' - '+event.end}</p>
            </div>
            <div className='flex flex-row space-x-2 items-center'>
              <SlLocationPin size={16} className='text-[rgb(0,175,240)]'/>
              <p className='text-xs text-[rgb(0,175,240)] font-jostSemi'>{event.venue}</p>
            </div>
        </div>
    </div>
)
}