import React, {useEffect, useState} from 'react'
/* import {CIJob} from "../CoazIcons" */
import {FaRegCircle, FaRegDotCircle} from "react-icons/fa";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";

const Careers = () => {
  const [countryFilter, setCountryFilter] = useState({property:'country',values:[]});
  const [filteredVacancies,setFilteredVacancies] = useState([]);
  const [selectAll,setSelectAll] = useState(false);

  let vacancies = [
    {
      logo:'/uploads/images/Airtel-logo.png',
      company:'Airtel',
      position:'Clinician',
      country:'Zambia',
      province:'Copper belt',
      district:'Kitwe',
      vacancies:4,
      postedOn:'',
      closingOn:'',
      comments:[]
    },{
      logo:'/uploads/images/MTN-Logo.png',
      company:'Mtn',
      position:'Clinician',
      country:'Zambia',
      province:'Eastern',
      district:'Chipata',
      vacancies:14,
      postedOn:'',
      closingOn:'',
      comments:[]
    },{
      logo:'/uploads/images/spring-boot.png',
      company:'Spring boot',
      position:'clinician',
      country:'Malawi',
      province:'Lusaka',
      district:'Chongwe',
      vacancies:6,
      postedOn:'',
      closingOn:'',
      comments:[]
    },{
      logo:'/uploads/images/zamtel-zambia-logo.png',
      company:'Zamtel',
      position:'Clinician',
      country:'Zimbabwe',
      province:'Harare',
      district:'Harare',
      vacancies:9,
      postedOn:'',
      closingOn:'',
      comments:[]
    }
  ];

  const doFilter = () => {
    let includes = [];
    vacancies.forEach(vacancy => {
      let include = false;
      if(countryFilter.values.find(value => {return value === vacancy.country})) {
        include = true;
      }
      if(include) {
        includes.push(vacancy);
      }
    });
    setFilteredVacancies(includes);
  }

  return (
    <div className='w-full h-auto mt-8'>
        <div style={{boxShadow:'0 4px 20px 5px rgba(0, 0, 0, 0.05), 0 10px 20px 20px rgba(0, 0, 0, 0.03)'}} 
            className='flex flex-col lg:flex-row h-auto mx-auto mb-24 bg-[rgb(247,247,247)]'>
            <div className='flex flex-col space-y-4 items-center justify-center w-full lg:w-1/3 p-8'>
                {/* <CIJob size={80} fill='black'/> */}
                <p className='text-3xl font-leBeauneNew font-semibold'>Jobs</p>
                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                    Explore job opportunities and career pathways available to clinical officers in Zambia. COAZ 
                    provides information on job openings, training programs, and professional development 
                    opportunities to support clinical officers in their career advancement and contribute to 
                    meaningful healthcare impact
                </p>
            </div>
            <div className='flex flex-col w-full lg:w-2/3 h-64 sm:h-96 lg:h-[512px] shrink-0 bg-[url(/public/images/img_34.jpg)] bg-cover'></div>
        </div>
        <div className='flex flex-col space-y-4 w-full h-auto mb-8'>
          <div className='flex flex-row space-x-8 w-full h-auto mx-auto'>
              <p className='text-3xl font-leBeauneNew'>Vacancies</p>
              <div className='w-full h-px border-t border-[rgb(204,204,204)] my-auto'/>
          </div>
          <div className='flex flex-row w-full h-auto mx-auto'>
              {/* <div className='flex flex-col w-[30%] h-auto'>
                  <div className='flex flex-row justify-between w-full h-8 px-2'>
                      <p className='w-full m-auto font-jostSemi tracking-wider text-xs text-[rgb(120,120,120)] uppercase'>Filters</p>
                      <p className='m-auto font-jostSemi tracking-wider text-xs text-[rgb(120,120,120)] uppercase cursor-pointer'>Reset</p>
                  </div>
                  <Filter filter={countryFilter} vacancies={vacancies} selectAll={selectAll} setSelectAll={setSelectAll} doFilter={doFilter}/>
              </div> */}
              <Vacancies vacancies={selectAll?vacancies:filteredVacancies}/>
          </div>
        </div>
    </div>
  )
}

export default Careers

const Vacancies = ({vacancies}) => {
  return (
    <div className='flex flex-col space-y-px w-[70%] h-auto mt-8'>
        {vacancies.map((vacancy,i) => 
          <div className='flex flex-row w-[98%] h-20 shrink-0 mx-auto p-2 bg-[rgb(247,247,247)]'>
              <img src={vacancy.logo} className='w-20 h-full shrink-0 object-contain'/>
              <div className='flex flex-row w-full h-full'>

              </div>
          </div>
        )}
    </div>
  )
}

const Filter = ({filter,vacancies,selectAll,setSelectAll,doFilter}) => {
  const [expanded,setExpanded] = useState(false);
  const [filterItems,setFilterItems] = useState([]);

  useEffect(() => {
    for (const vacancy of vacancies) {
      if(!filterItems.find((filterItem) => {return filterItem.value === vacancy[filter.property]})) {
        filterItems.push({value:vacancy[filter.property],selected:false});
      }
    }
  },[])

  return (
    <div className='flex flex-col space-y-1 w-full h-auto bg-[rgb(247,247,247)]'>
        <div onClick={(e) => setExpanded(!expanded)} 
            className='flex flex-row w-full h-8 shrink-0 justify-between px-2 cursor-pointer'>
            <p className='w-full m-auto font-jostBook tracking-wider text-sm text-[rgb(120,120,120)] capitalize'>
              {filter.property}
            </p>
            <div className='w-4 h-auto m-auto text-[rgb(120,120,120)]'>
                {expanded? <LiaAngleUpSolid size={16}/>:<LiaAngleDownSolid size={16}/>}
            </div>
        </div>
        <div style={{transition:'all 0.3s ease-in-out'}}
            className={`flex flex-col w-full ${expanded?'h-auto':'h-0'} overflow-hidden`}>
            {filterItems.map((filterItem,i) => <FilterItem key={i} filterItem={filterItem} filter={filter} doFilter={doFilter}/>)}
            <All selectAll={selectAll} setSelectAll={setSelectAll}/>
        </div>
    </div>
  )
}

const FilterItem = ({filterItem,filter,doFilter}) => {

  const handleClick = (e) => {
    e.preventDefault();
    filterItem.selected = !filterItem.selected;
    if(filterItem.selected) {
      filter.values.push(filterItem.value);
    } else {
      filter.values = filter.values.filter((value) => {return value !== filterItem.value});
    }
    doFilter();
  }
  return (
    <div onClick={handleClick}
      className='flex flex-row space-x-4 px-2 w-full h-8 cursor-pointer'>
      {filterItem.selected?
        <FaRegDotCircle  size={14} className='m-auto text-[rgb(0,175,240)]'/>:
        <FaRegCircle  size={14} className='m-auto text-[rgb(120,120,120)]'/>
      }
      <p className='w-full m-auto font-jostBook tracking-wider text-sm text-[rgb(120,120,120)] capitalize'>
        {filterItem.value}
      </p>
    </div>
  )
}

const All = ({selectAll,setSelectAll}) => {
  const handleClick = (e) => {
    e.preventDefault();
    setSelectAll(!selectAll);
  }
  return (
    <div onClick={handleClick}
      className='flex flex-row space-x-4 px-2 w-full h-8 cursor-pointer'>
      {selectAll?
        <FaRegDotCircle  size={14} className='m-auto text-[rgb(0,175,240)]'/>:
        <FaRegCircle  size={14} className='m-auto text-[rgb(120,120,120)]'/>
      }
      <p className='w-full m-auto font-jostBook tracking-wider text-sm text-[rgb(120,120,120)] capitalize'>
        All
      </p>
    </div>
  )
}