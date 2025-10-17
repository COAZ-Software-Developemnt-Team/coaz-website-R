import React, {useContext, useEffect, useRef, useState} from "react";
import {PiCaretDown, PiCaretRight} from "react-icons/pi";
import {Logo} from "./CoazIcons";
import {FaPaperPlane, FaPhoneAlt, FaTimes, FaUserCircle} from "react-icons/fa";
import {FaBars} from "react-icons/fa6";
import {menus} from "../data";
import Search from "../components/Search";
import {renderToStaticMarkup} from 'react-dom/server'
import {Link, NavLink, useInRouterContext} from "react-router-dom";
import {UserContext} from "../contexts/UserContext";


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

const Menu = () => {
  const [selected, setSelected] = useState(null);
  const [navbarMenus,setNavbarMenus] = useState(null); 
  const menuButtonsRef = useRef(null);
  const more = 'More';
  const mobileMenuRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(UserContext);




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
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const px = 'px-4 xs:px-[8%] sm:px-[13%] md:px-[5%] xl:px-[13%]'


    return (
        <div style={{backgroundImage: 'url(/images/bg_8.jpg)'}}
             className={`relative flex flex-col space-y-4 w-full h-fit md:h-36 py-4 md:py-0  bg-center bg-cover shrink-0`}>
            <div style={{background: 'linear-gradient(to right, #1566ad 0%, #1b9de3 100%)', opacity: '.8'}}
                 className="absolute left-0 top-0 w-full h-full"/>
            {/*     TOP BAR */}
            <div className={`flex flex-row w-full h-auto ${px} z-10 items-center justify-between text-white shrink-0`}>
                <div className="flex flex-row space-x-4 items-center">
                    <button id="logo-container" 
                        style={{transition: "all .5s ease-in-out"}}
                        className="flex w-[56px] h-[56px] sm:w-[80px] sm:h-[80px] items-center justify-center shrink-0"
                    >
                        <Link to="/home">
                        <Logo fill="white"
                        />
                        </Link>

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
                        <p className="font-nunitoSansLight">+260761234390</p>
                    </div>
                    <div className="hidden md:block w-fit h-fit space-x-2">
                        <Search/>
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                        {!user ? (

                            <button className="p-1 w-auto text-white bg-[rgb(0,175,240)] rounded-full">
                                <Link to="/login">Login</Link>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <FaUserCircle size={24} />
                                <span>{user.username}</span>
                                <button onClick={logout} className="text-red-500 text-sm ml-2">Logout</button>
                            </div>
                        )}

                        {/*{user && (*/}
                        {/*    <button*/}
                        {/*        onClick={() => setSidebarOpen(!sidebarOpen)}*/}
                        {/*        className="text-2xl"*/}
                        {/*    >*/}
                        {/*        <FaBars size={20}/>*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </div>


                </div>
            </div>
            {/*DESKTOP MENU*/}
            <div ref={menuButtonsRef}
                 className={`hidden md:flex py-2 w-full h-16 sm:h-16 px-2 sm:px-4 items-center z-50 bg-white shrink-0 shadow-lg`}>
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
            {/*Mobile Top Bar */}
            <div className="relative w-full h-fit md:hidden">
                <div
                    className="relative flex flex-row w-full h-[56px] px-4 bg-white gap-2 rounded-full items-center justify-between z-10 overflow-hidden"
                    style={{ marginTop: '-10px' }}
                >
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex w-8 h-8 text-theme items-center justify-center cursor-pointer shrink-0">
                        {mobileOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
                    </button>

                    <div className='w-full h-fit'>
                        <Search/>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {mobileOpen && (
                    <div className="absolute top-[60px] left-0 w-full bg-white shadow-lg rounded-lg z-50 p-4 space-y-2 animate-slideDown">
                        {menus.map((menu, i) => (
                            <MenuButton
                                key={i}
                                name={menu.name}
                                link={menu.link}
                                menus={menu.menus}
                                mobileMode={true}
                                setSelected={() => setMobileOpen(false)
                                    // setSelected(menu.name);
                                    // setMobileOpen(false); // close after selecting

                                }
                                closeParentDropDown={() => setMobileOpen(false)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Menu;

const MenuButton = ({name, link, menus, parentRef, setSelected, closeParentDropDown, mobileMode}) => {
    const [droppedDown, setDroppedDown] = useState(false);
    const menuRef = useRef(null);
    const dropDownRef = useRef(null);
    const menusRef = useRef(null);
    const isInRouterContext = useInRouterContext();

    const toggleDropDown = () => {
        if (menus && menus.length > 0) {
            setDroppedDown(!droppedDown);
        } else {
            if (setSelected) setSelected(name);
            if (closeParentDropDown) closeParentDropDown();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setDroppedDown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (

      <div ref={menuRef} className="relative w-full">
          {/* Main button */}
          <div
              onClick={toggleDropDown}
              className={`flex flex-row items-center justify-between px-4 py-2 cursor-pointer 
          ${mobileMode ? "border-b border-gray-200" : "text-heading"}`}
          >
              {isInRouterContext && !menus ? (
                  <NavLink
                      to={link || '/'}
                      onClick={() => {
                          if (closeParentDropDown) closeParentDropDown();
                      }}
                      className={({isActive}) => `${isActive ? 'text-[rgb(0,175,240)]' : 'text-[rgb(68,71,70)]'}`}
                  >
                      {name}
                  </NavLink>
              ) : (
                  <p className="capitalize">{name}</p>
              )}

              {menus && menus.length > 0 && (
                  <span>{mobileMode ? <PiCaretDown size={16}/> : <PiCaretRight size={16}/>}</span>
              )}
          </div>

          {mobileMode && menus && droppedDown && (
              <div className="ml-4 border-l border-gray-200">
                  {menus.map((menu, i) => (
                      <MenuButton
                          key={i}
                          name={menu.name}
                          link={menu.link}
                          menus={menu.menus}
                          mobileMode={true}
                          setSelected={setSelected}
                          closeParentDropDown={closeParentDropDown}
                      />
                  ))}
              </div>
          )}

          {/* Submenu for desktop (unchanged) */}
          {!mobileMode && menus && droppedDown && (
              <div
                  ref={dropDownRef}
                      className="absolute left-0 top-full bg-white shadow-lg rounded-md z-10"
              >
                  <div ref={menusRef} className="flex flex-col w-full">
                  {menus.map((menu, i) => (
                      <MenuButton
                          key={i}
                          name={menu.name}
                          link={menu.link}
                          menus={menu.menus}
                          parentRef
                          setSelected={setSelected}
                          closeParentDropDown={closeParentDropDown}
                      />
                  ))}
              </div>
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
