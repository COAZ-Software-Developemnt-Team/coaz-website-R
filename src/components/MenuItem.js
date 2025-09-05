import React, {useState} from 'react';



const MenuItem = ({id,name,Icon,categories,setShowCategories,setCloseCategories,menus,dropDownId,dropDownComponent}) => {
    const [dropDown, setDropDown] = useState(null);
    const [show,setShow] = useState(false);

    const handleMouseEnter = () => {
        if(dropDownComponent) {
            if(!show) {
                setShow(true);
                setDropDown({
                    id:dropDownId,
                    dropDownComponent:dropDownComponent,
                    menus:menus
                });
            }
        } else if(categories) {
            setShowCategories(true);
            setCloseCategories(false);
        }
    }

    const handleMouseLeave = (e) => {
        if(dropDownComponent || categories) {
            let thisMenu = document.getElementById(id);
            if(thisMenu) {
                let rect = thisMenu.getBoundingClientRect();
                if(e.clientY < rect.bottom) {
                    if(dropDownComponent) {
                        setShow(false);
                    }
                    if(categories) {
                        setShowCategories(false);
                    }
                }
            }
        }
    }

    return (
        <div onClick={()=>setShow(false)} className='relative flex h-full'>
            {menus?
                <button id={id}
                        onClick={(e) => {
                            if(!show) {
                                e.preventDefault();
                                e.stopPropagation();
                                handleMouseEnter(e);
                            }
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e)}
                        onMouseLeave={(e) => handleMouseLeave(e)}
                        style={{transition:'all .3s ease-in-out'}}
                        className='flex items-center h-full font-jost-medium tracking-wide whitespace-nowrap text-ellipsis capitalize hover:text-[rgb(0,175,240)]'
                >
                    {Icon?<Icon size={20}/>:name}
                </button>:
                <button id={id}
                        onMouseEnter={(e) => handleMouseEnter(e)}
                        onMouseLeave={(e) => handleMouseLeave(e)}
                        style={{transition:'all .3s ease-in-out'}}
                        className='flex items-center h-full font-jost-medium tracking-wide whitespace-nowrap text-ellipsis capitalize hover:text-[rgb(0,175,240)]'
                >
                    {Icon?<Icon size={20}/>:name}
                </button>

            }

            {dropDown && (<dropDown.dropDownComponent parentDir={id} show={show} setShow={setShow} dropDown={dropDown} setDropDown={setDropDown}/>)}
        </div>
    )
}

export default MenuItem