import React, {useState, useEffect, useRef} from "react";
import {PiCaretDown, PiCaretRight} from "react-icons/pi";
import {Logo} from "./CoazIcons";
import {FaPaperPlane, FaPhoneAlt} from "react-icons/fa";
import {FaBars} from "react-icons/fa6";
import {menus} from "../data";
import Search from "../components/Search";
import {renderToStaticMarkup} from 'react-dom/server'
import {useInRouterContext, NavLink} from "react-router-dom";

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
    const [navbarMenus, setNavbarMenus] = useState(null);
    const menuButtonsRef = useRef(null);
    const more = 'More';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


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
                        <button
                            className="p-1 w-auto font-nunitoSansRegular text-white rounded-full cursor-pointer shrink-0 text-nowrap">
                            <a href="https://portal.coaz.org/register"
                               target="_blank"
                               rel="noopener noreferrer"
                            >
                                Register
                            </a>
                        </button>
                        <div className="h-4 border-l border-white"/>
                        <button
                            className="p-1 w-auto font-nunitoSansRegular text-white rounded-full cursor-pointer shrink-0 text-nowrap">
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
            {/*Desktop Menu*/}
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
                        />
                    )}

                </div>
            </div>

            {/*Mobile View*/}
            <div className="relative w-full h-fit">
                <div
                    className="relative md:hidden flex flex-row w-full h-[56px] px-4 bg-white gap-2 rounded-full items-center justify-between z-10 overflow-hidden"
                    style={{marginTop: '-10px'}}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMobileMenuOpen(!mobileMenuOpen);
                        }}
                        className="flex w-8 h-8 text-theme items-center justify-center cursor-pointer shrink-0"
                    >
                        <FaBars size={20}/>
                    </button>

                    <div className='w-full h-fit'>
                        <Search/>
                    </div>
                </div>
                {/* Show mobile dropdown if open */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md z-20">
                        {navbarMenus && navbarMenus.length > 0 && navbarMenus.map((menu, i) => (
                            <MenuButton
                                key={i}
                                name={menu.name ? menu.name : ''}
                                link={menu.link ? menu.link : '/'}
                                menus={menu.menus && menu.menus.length > 0 ? menu.menus : null}
                                setSelected={setSelected}
                                mobileMode={true}
                            />
                        ))}
                    </div>
                )}
            </div>
            </div>
    );
};

export default Menu;

const MenuButton = ({name, link, menus, parentRef, setSelected,closeParentDropDown, mobileMode}) => {
    const [droppedDown, setDroppedDown] = useState(false);
    const isInRouterContext = useInRouterContext();

    const toggleDropdown = (e) => {
        e.stopPropagation();
        if (menus && menus.length > 0) {
            setDroppedDown(!droppedDown);
        } else {
            if (setSelected) setSelected(name);
            if (closeParentDropDown) closeParentDropDown();
        }
    };



    return (
        <div
            onClick={toggleDropdown}
            id={name}
            className="relative flex flex-col text-heading cursor-pointer capitalize"
        >
            {/* Main Menu Text */}
            {menus && menus.length > 0 ? (
                <MenuText name={name} menus={menus} parentRef={parentRef} mobileMode={mobileMode} open={droppedDown} />
            ) : isInRouterContext ? (
                <NavLink
                    to={link || "/"}
                    className={({ isActive }) =>
                        `${isActive ? "text-[rgb(0,175,240)]" : "text-[rgb(68,71,70)]"}`
                    }
                    onClick={() => {
                        if (setSelected) setSelected(name);
                        if (closeParentDropDown) closeParentDropDown();
                    }}
                >
                    <MenuText name={name} parentRef={parentRef} />
                </NavLink>
            ) : (
                <MenuText name={name} parentRef={parentRef} />
            )}

            {/* Desktop Dropdown */}
            {!mobileMode && menus && menus.length > 0 && (
                <div
                    className={`absolute left-0 top-full bg-[rgb(243,244,245)] custom-shadow z-40 transition-all duration-300 overflow-hidden
            ${droppedDown ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}
                >
                    <div className="flex flex-col w-full">
                        {menus.map((menu, i) => (
                            <MenuButton
                                key={i}
                                name={menu.name}
                                link={menu.link}
                                menus={menu.menus}
                                parentRef={parentRef}
                                setSelected={setSelected}
                                closeParentDropDown={() => setDroppedDown(false)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Dropdown */}
            {mobileMode && droppedDown && (
                <div className="flex flex-col w-full pl-4 border-l border-gray-300">
                    {menus.map((menu, i) => (
                        <MenuButton
                            key={i}
                            name={menu.name}
                            link={menu.link}
                            menus={menu.menus}
                            parentRef={parentRef}
                            setSelected={setSelected}
                            mobileMode={true}
                        />
                    ))}
                </div>
            )}
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
