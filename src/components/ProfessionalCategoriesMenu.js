import React, {useEffect} from 'react'
import {Logo} from '../CoazIcons';
import DropDownItem from './DropDownItem';
import { categories } from '../data';

const ProfessionalCategoriesMenu = ({show,setShow,close,setClose}) => {
    const handleMouseLeave = (e) => {
        setShow(false);
    }
  
    useEffect(() => {
        let menuItems = document.getElementsByClassName('menu-items')[0];
        let professionalCategories = document.getElementById('professional_categories');
        if(show) {
            if(menuItems && professionalCategories) {
                let margin = 96;
                professionalCategories.style.top = '210px';
                professionalCategories.style.left = margin+'px';
                professionalCategories.style.right = margin+'px';
                professionalCategories.style.visibility = 'visible';
                professionalCategories.style.opacity = 1;
                professionalCategories.animate({opacity:[0,1]},{duration:500});
            }
        } else {
            if(professionalCategories) {
                professionalCategories.animate({opacity:[1,0]},{duration:500}).addEventListener('finish',() => {
                    professionalCategories.style.visibility = 'hidden';
                    setClose(true);
                });
            };
        }
    },[show,close]);
  
    return (
      <div id='professional_categories' 
            onMouseLeave={(e) => handleMouseLeave(e)} 
            onClick={(e) => setShow(false)}
            className='fixed flex flex-row invisible opacity-0 min-h-[320px]  h-auto shrink-0 bg-[rgb(238,238,238)] z-30 shadow-md overflow-hidden'>
            {categories.map((category,i) => 
                <CategorySection key={i} name={category.name} professionalCategories={category.professionalCatories} width={100/(categories.length+1)}/>
            )}
            <div style={{width: 100/(categories.length+1)+'%'}} 
                className='flex flex-col items-center justify-center min-h-[320px]  h-auto bg-[url(/public/images/img_15.jpg)] bg-cover bg-center'>
                <div id='logo-container2' className='flex w-24 h-24'>
                    <Logo size={96} fill='rgb(238,238,238)'/>
                </div>
                <p className='flex w-64 h-auto font-jostBook text-sm text-center text-[rgb(238,238,238)]'>
                    Provide support and assistance to Clinicians falling under different professional 
                    categories
                </p>
            </div>
      </div>
    )
}

export default ProfessionalCategoriesMenu

const CategorySection = ({name,professionalCategories,width}) => {
    return (
        <div style={{width:width+'%'}}  className='flex flex-col space-y-6 min-h-[320px] h-auto px-4 shrink-0 py-12  border-r border-[rgb(221,221,221)]'>
            <h1 className='flex font-jostBold px-6 text-black'>{name}</h1>
            <div className='flex flex-col space-y-3'>
                {professionalCategories && professionalCategories.map((professionalCategory,i) =>
                    <DropDownItem key={i} menu={professionalCategory}/>
                )}
            </div>
        </div>
    )
}


