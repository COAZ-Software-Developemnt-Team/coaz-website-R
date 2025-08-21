
import React, { useState, useEffect, useRef } from "react";
import { PiCaretDown, PiCaretRight } from "react-icons/pi";
import { Logo } from "./CoazIcons";
import { FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import {menus} from "../data";
import Search from "../components/Search";
import { renderToStaticMarkup } from 'react-dom/server'
import { useInRouterContext, NavLink } from "react-router-dom";

const calcWidth = (Component) => {
    if (!Component) {
        return 0;
    }
    let span = document.createElement("span");
    document.body.appendChild(span);
    span.style.height = '0';
    span.style.width = 'fit-content';
    span.style.position = 'absolute';
    span.style.overflow = 'hidden';
    span.style.whiteSpace = 'no-wrap';
    span.innerHTML = renderToStaticMarkup(Component);
    let width = Math.ceil(span.clientWidth);
    document.body.removeChild(span);
    return width;
}

const calcSize = (Component) => {
    if (!Component) {
        return {width: 0, height: 0};
    }
    let span = document.createElement("span");
    document.body.appendChild(span);
    span.style.height = 'fit';
    span.style.width = 'fit-content';
    span.style.position = 'absolute';
    span.style.overflow = 'hidden';
    span.style.whiteSpace = 'no-wrap';
    span.innerHTML = renderToStaticMarkup(Component);
    let width = Math.ceil(span.clientWidth);
    let height = Math.ceil(span.clientHeight);
    document.body.removeChild(span);
    return {width: width, height: height};
}

const Menu = () => {
  const [selected, setSelected] = useState(null);
  const [navbarMenus,setNavbarMenus] = useState(null); 
  const menuButtonsRef = useRef(null);
  const highlightRef = useRef(null);
  const more = 'More';

    const onEnter = (e) => {
        e.preventDefault();
        if (highlightRef.current) {
            let padding = 16;
            let x = e.target.offsetLeft;
            let width = e.target.offsetWidth;
            highlightRef.current.style.left = x + padding + "px";
            highlightRef.current.style.width = width - padding * 2 + "px";
        }
    };

  const onLeave = (e) => {
    e.preventDefault();
    if (selected) {
      const active = document.getElementById(selected);
      if (active) {
        //let padding = 16;
        //let x = active.offsetLeft;
        //let width = active.offsetWidth;
        //highlightRef.current.style.left = x + padding + "px";
        //highlightRef.current.style.width = width - padding * 2 + "px";
      }
    }
  };

    const reduceMenus = (menus) => {
        if (!menus || menus.length < 1) {
            return;
        }
        if (menus.length > 1 && menus[menus.length - 1].name === more) {
            let removed = menus.splice(menus.length - 2, 1);
            if (removed.length > 0) {
                menus[menus.length - 1].menus.unshift(removed[0]);
            }
        } else if (menus.length > 2) {
            let subMenus = [];
            subMenus.push(menus.pop());
            subMenus.push(menus.pop());
            menus.push({
                name: more,
                menus: subMenus
            })
        }
    }

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                let btnsWidth = entry.target.offsetWidth;
                if (btnsWidth > 1) {
                    let menusCopy = JSON.parse(JSON.stringify(menus));
                    let width = calcWidth(
                        <div className="relative flex flex-row w-fit h-fit px-4">
                            {menusCopy && menusCopy.length > 0 && menusCopy.map((menu, i) =>
                                <MenuButton
                                    key={i}
                                    name={menu.name ? menu.name : ''}
                                    link={menu.link ? menu.link : '/'}
                                    menus={menu.menus && menu.menus.length > 0 ? menu.menus : null}
                                />
                            )}
                        </div>
                    );

                    for (; width > btnsWidth;) {
                        reduceMenus(menusCopy);
                        width = calcWidth(
                            <div className="relative flex flex-row w-fit h-fit px-4">
                                {menusCopy && menusCopy.length > 0 && menusCopy.map((menu, i) =>
                                    <MenuButton
                                        key={i}
                                        name={menu.name ? menu.name : ''}
                                        link={menu.link ? menu.link : '/'}
                                        menus={menu.menus && menu.menus.length > 0 ? menu.menus : null}
                                    />
                                )}
                            </div>
                        );
                    }

                    setNavbarMenus(menusCopy);
                }
            }
        });
        if (menuButtonsRef.current) {
            observer.observe(menuButtonsRef.current)
        }
        return () => {
            observer.disconnect();
        }


    }, [])

    const px = 'px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%]'

    return (
        /* <div style={{backgroundImage: 'url(/images/bg_8.jpg)'}}
             className='relative flex flex-col space-y-4 w-full h-fit md:h-36 py-4 md:py-0 px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%] bg-center bg-cover shrink-0'>
            <div style={{background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)', opacity: '.8'}}
                 className="absolute left-0 top-0 w-full h-full"/>
            <div className="flex flex-row w-full h-auto z-10 items-center justify-between text-white shrink-0">
                <div className="flex flex-row space-x-4 items-center">
                    <button id="logo-container" 
                        style={{transition: "all .5s ease-in-out"}}
                        className="flex w-[56px] h-[56px] sm:w-[80px] sm:h-[80px] items-center justify-center shrink-0"
                    >
                        <Logo fill="white"/>
                    </button>
                    <p className='text-4xl md:text-5xl font-nunitoSansBlack'>COAZ</p>
                </div>
                <div className="flex flex-row w-fit h-fit text-sm space-x-8">
                    <div className="hidden xl:flex flex-row items-center space-x-1">
                        <FaPaperPlane size={20}/>
                        <p className="font-nunitoSansSemiBold">Email :</p>
                        <p className="font-nunitoSansLight">info@coaz.com</p>
                    </div>
                    <div className="hidden xl:flex flex-row items-center space-x-1">
                        <FaPhoneAlt size={20}/>
                        <p className="font-nunitoSansSemiBold">Cell :</p>
                        <p className="font-nunitoSansLight">+260 979 123 456</p>
                    </div>
                    <div className="hidden md:block w-fit h-fit space-x-2">
                        <Search/>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <button className="p-1 w-auto font-nunitoSansRegular text-white rounded-full cursor-pointer shrink-0 text-nowrap">
                            <a href="#user-form">
                                Register
                            </a>
                        </button>
                        <div className="h-4 border-l border-white" />
                        <button className="p-1 w-auto font-nunitoSansRegular text-white rounded-full cursor-pointer shrink-0 text-nowrap">
                            <a href="https://portal.coaz.org/login"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Log In
                            </a>
                        </button>
                    </div>
                </div>
            </div>
            <div ref={menuButtonsRef}
                 className={`hidden md:flex py-2 border w-full h-16 sm:h-16 px-2 sm:px-4 items-center z-10 bg-white shrink-0 shadow-lg`}>
                <div className="relative hidden sm:flex flex-row w-full h-fit items-center justify-center">
                    {navbarMenus && navbarMenus.length > 0 && navbarMenus.map((menu, i) =>
                        <MenuButton
                            key={i}
                            name={menu.name ? menu.name : ''}
                            link={menu.link ? menu.link : '/'}
                            menus={menu.menus && menu.menus.length > 0 ? menu.menus : null}
                            setSelected={setSelected}
                            onEnter={onEnter}
                            onLeave={onLeave}
                        />
                    )}

                </div>
            </div>
            <div className="relative w-full h-fit">
                <div
                    className="relative md:hidden flex flex-row w-full h-[56px] px-4 bg-white gap-2 rounded-full items-center justify-between z-10 overflow-hidden"
                    style={{ marginTop: '-20px' }}
                >
                    <button className="flex w-8 h-8 text-theme items-center justify-center cursor-pointer shrink-0">
                        <FaBars size={20}/>
                    </button>

                    <div className='w-full h-fit'>
                        <Search/>
                    </div>
                </div>
            </div>
        </div> */
        <div style={{backgroundImage: 'url(/images/bg_8.jpg)'}}
             className={`relative flex flex-col space-y-4 w-full h-fit md:h-36 py-4 md:py-0  bg-center bg-cover shrink-0`}>
            <div style={{background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)', opacity: '.8'}}
                 className="absolute left-0 top-0 w-full h-full"/>
            <div className={`flex flex-row w-full h-auto ${px} z-10 items-center justify-between text-white shrink-0`}>
                <div className="flex flex-row space-x-4 items-center">
                    <button id="logo-container" 
                        style={{transition: "all .5s ease-in-out"}}
                        className="flex w-[56px] h-[56px] sm:w-[80px] sm:h-[80px] items-center justify-center shrink-0"
                    >
                        <Logo fill="white"/>
                    </button>
                    <p className='text-4xl md:text-5xl font-nunitoSansBlack'>COAZ</p>
                </div>
                <div className="flex flex-row w-fit h-fit text-sm space-x-8">
                    <div className="hidden xl:flex flex-row items-center space-x-1">
                        <FaPaperPlane size={20}/>
                        <p className="font-nunitoSansSemiBold">Email :</p>
                        <p className="font-nunitoSansLight">info@coaz.com</p>
                    </div>
                    <div className="hidden xl:flex flex-row items-center space-x-1">
                        <FaPhoneAlt size={20}/>
                        <p className="font-nunitoSansSemiBold">Cell :</p>
                        <p className="font-nunitoSansLight">+260 979 123 456</p>
                    </div>
                    <div className="hidden md:block w-fit h-fit space-x-2">
                        <Search/>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <button className="p-1 w-auto font-nunitoSansRegular text-white rounded-full cursor-pointer shrink-0 text-nowrap">
                            <a href="#user-form">
                                Register
                            </a>
                        </button>
                        <div className="h-4 border-l border-white" />
                        <button className="p-1 w-auto font-nunitoSansRegular text-white rounded-full cursor-pointer shrink-0 text-nowrap">
                            <a href="https://portal.coaz.org/login"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Log In
                            </a>
                        </button>
                    </div>
                </div>
            </div>
            <div ref={menuButtonsRef}
                 className={`hidden md:flex py-2 w-full h-16 sm:h-16 px-2 sm:px-4 items-center z-10 bg-white shrink-0 shadow-lg`}>
                <div className="relative hidden sm:flex flex-row w-full h-fit items-center justify-center">
                    {navbarMenus && navbarMenus.length > 0 && navbarMenus.map((menu, i) =>
                        <MenuButton
                            key={i}
                            name={menu.name ? menu.name : ''}
                            link={menu.link ? menu.link : '/'}
                            menus={menu.menus && menu.menus.length > 0 ? menu.menus : null}
                            setSelected={setSelected}
                            onEnter={onEnter}
                            onLeave={onLeave}
                        />
                    )}

                </div>
            </div>
            <div className="relative w-full h-fit">
                <div
                    className="relative md:hidden flex flex-row w-full h-[56px] px-4 bg-white gap-2 rounded-full items-center justify-between z-10 overflow-hidden"
                    style={{ marginTop: '-20px' }}
                >
                    <button className="flex w-8 h-8 text-theme items-center justify-center cursor-pointer shrink-0">
                        <FaBars size={20}/>
                    </button>

                    <div className='w-full h-fit'>
                        <Search/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;

const MenuButton = ({name, link, menus, parentRef, setSelected, onEnter, onLeave, closeParentDropDown, mobileMode}) => {
    const [droppedDown, setDroppedDown] = useState(false);
    const menuRef = useRef(null);
    const dropDownRef = useRef(null);
    const menusRef = useRef(null);
    const isInRouterContext = useInRouterContext();

    const dropDown = () => {
        if (!droppedDown) {
            if (menuRef.current && dropDownRef.current && menusRef.current) {
                let parent = menuRef.current;
                do {
                    parent = parent.parentElement;
                } while (parent && parent.tagName.toLowerCase() != 'header');
                if (parent) {
                    let size = calcSize(
                        <div className="flex flex-col w-fit h-fit px-4 overflow-visible">
                            {menus && menus.length > 0 && menus.map((menu, i) =>
                                <MenuText key={i} name={menu.name} menus={menu.menus} parentRef={menuRef} isCalc={true}/>
                            )}
                        </div>

                    );
                    let viewWidth = parent.clientWidth;
                    let menuRect = menuRef.current.getBoundingClientRect();
                    menuRef.current.style.overflow = 'visible';
                    if (parentRef) {
                        dropDownRef.current.style.top = '0';
                        if ((menuRect.right + size.width) > viewWidth) {
                            dropDownRef.current.style.left = (0 - size.width) + 'px';
                        } else {
                            dropDownRef.current.style.left = '100%';
                        }
                    } else {
                        dropDownRef.current.style.top = '100%';
                    }
                    dropDownRef.current.style.width = size.width + 'px';
                    dropDownRef.current.style.opacity = '1';
                    dropDownRef.current.animate({height: [0, size.height + 'px']}, {
                        duration: 500,
                        easing: 'ease-in-out'
                    }).addEventListener('finish', () => {
                        dropDownRef.current.style.height = size.height + 'px';
                        menusRef.current.style.overflow = 'visible';
                    });
                }
            }
            setDroppedDown(true);
        }
    }

    const closeDropDown = () => {
        setDroppedDown(false);
        if (menuRef.current && dropDownRef.current) {
            dropDownRef.current.animate({opacity: [1, 0]}, {duration: 500}).addEventListener('finish', () => {
                dropDownRef.current.style.width = '0';
                dropDownRef.current.style.height = '0';
                dropDownRef.current.style.transition = 'none';
                menuRef.current.style.overflow = 'hidden';
                menusRef.current.style.overflow = 'hidden';
            });
        }
        //closeParentDropDown && closeParentDropDown();
    }

    const onMouseEnter = (e) => {
        e.preventDefault();
        dropDown();
        onEnter(e);
    }

    const onMouseLeave = (e) => {
        e.preventDefault();
        closeDropDown();
        onLeave(e);
    }

  return (
    <div
      ref={menuRef}
      onClick={(e) => {
        e.stopPropagation();
        if(menus && menus.length > 0) {
          if(!droppedDown) {
            dropDown();
          } else {
            closeDropDown();
          }
        } else {
            if(setSelected) {
                setSelected(name);
            }
            if(closeParentDropDown) {
                closeParentDropDown();
            }
        }
      }}
            onMouseOver={() => {

            }}
            onMouseEnter={(e) => {
                onMouseEnter(e);
            }}
            onMouseLeave={onMouseLeave}
            id={name}
            style={{transition: 'all .5s ease-in-out'}}
            className={`relative flex flex-row text-heading items-center overflow-hidden cursor-pointer shrink-0 capitalize`}
        >
            {menus && menus.length > 0 ?
                <>
                    <MenuText name={name} menus={menus} parentRef={parentRef} mobileMode={mobileMode}/>
                    <div ref={dropDownRef}
                         className="absolute left-0 top-full w-0 h-0 bg-[rgb(243,244,245)] custom-shadow z-40">
                        <div ref={menusRef} className="relative flex flex-col w-full h-full overflow-hidden">
                            {menus && menus.length > 0 && menus.map((menu, i) =>
                                <MenuButton
                                    key={i}
                                    name={menu.name ? menu.name : 'null'}
                                    link={menu.link ? menu.link : '/'}
                                    menus={menu.menus && menu.menus.length > 0 ? menu.menus : null}
                                    parentRef={menuRef}
                                    setSelected={setSelected}
                                    onEnter={onEnter}
                                    onLeave={onLeave}
                                    closeParentDropDown={closeDropDown}
                                />
                            )}
                        </div>
                    </div>
                </>
                :
                isInRouterContext?
                <NavLink to={link ? link : '/'} className={({isActive}) => {return `${isActive?'text-[rgb(0,175,240)]':'text-[rgb(68,71,70)]'}`}}>
                    <MenuText name={name} parentRef={parentRef}/>
                </NavLink>:
                <MenuText name={name} parentRef={parentRef}/>
            }
        </div>
    );
};

const MenuText = ({name, menus, parentRef, isCalc, mobileMode}) => {
    return (
        <div
            className={`flex flex-row ${parentRef || mobileMode ? isCalc ? 'w-fit space-x-2 font-nunitoSansSemiBold' : 'w-full justify-between font-nunitoSansSemiBold' : 'font-nunitoSansBold w-fit space-x-2'} text-sm tracking-wider px-4 py-2 items-center shrink-0 capitalize`}>
            <p className='w-fit h-fit whitespace-nowrap'>{name}</p>
            {menus && menus.length > 0 ? parentRef ? <PiCaretRight size={16}/> : <PiCaretDown size={16}/> : <></>}
        </div>
    )
}
