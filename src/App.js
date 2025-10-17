import {Routes, Route,Router,Navigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import './App.css';
import './index.css'
import axios from "axios";
import {GlobalContext} from './contexts/GlobalContext';
import { UserProvider } from "./contexts/UserContext";
import {organisation, membership} from './data';
import Home from './components/Home';
import Main from './components/Main';
import ProfessionalCategories from './components/ProfessionalCategories';
import Services from './components/Services';
import Association from './components/Association';
import About from './components/About';
import Objective from './components/Objective';
import News from './components/News';
import Organisation from './components/Organisation';
import Membership from './components/Membership';
import More from "./components/More";
import CPD from './components/CPD';
import Development from "./components/Development";
import Form from "./components/Form";
import ChatBot from './components/ChatBot'; // Import ChatBot component




// axios.defaults.baseURL = 'http://localhost:8080/api/';
//axios.defaults.baseURL = 'http://localhost:8080/coaz/api/';
//axios.defaults.baseURL = 'http://192.168.0.161:8080/api/';
//axios.defaults.baseURL = 'https://coaz.org:8085/coaz_test/api/';
axios.defaults.baseURL = 'https://coaz.org:8085/coaz/api/';

const findMenu = (menu, link) => {
    if (menu.link == link) {
        return menu;
    } else if (menu.menus) {
        for (let subMenu of menu.menus) {
            let found = findMenu(subMenu, link);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

const createRoute = (menu, Element, key) => {
    let route = null;
    if (menu.menus) {
        route = <Route key={key} path={menu.link} element={<Element/>}>
            {menu.menus.map((submenu, i) =>
                createRoute(submenu, Element, key + i)
            )}
        </Route>
    } else if (menu.itemLink) {
        route = <Route key={key} path={menu.link} element={<Element/>}>
            <Route key={key + 1} path={menu.itemLink} element={<Element/>}/>
        </Route>
    } else {
        route = <Route key={key} path={menu.link} element={<Element/>}/>
    }
    return route;
}

function App() {
    const [screenSize, setScreenSize] = useState('lg');
    const [showDropMainMenu, setShowDropMainMenu] = useState(false);
    const [dialog, setDialog] = useState(null);


    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                let rect = entry.target.getBoundingClientRect();
                if (rect.width > 1024) {
                    setScreenSize('lg');
                } else if (rect.width > 640) {
                    setScreenSize('sm');
                } else {
                    setScreenSize('xs');
                }
            }
        });
        observer.observe(document.documentElement)
        return () => {
            observer.disconnect();
        };
    }, []);

    return (

        <div className='flex bg-white bg-cover bg-center w-full h-screen'>
            <GlobalContext.Provider value={{
                findMenu, screenSize, dialog, setDialog, showDropMainMenu, setShowDropMainMenu,
            }}>
                <UserProvider>
                <Routes>
                    <Route path='/' element={<Main/>}>
                        <Route index element={<Home/>}/>
                        <Route path='home' element={<Home/>}/>
                        <Route path='association/:duty?' element={<Association/>}/>
                        <Route path='services/:service?' element={<Services/>}/>
                        <Route path='categories/:category?' element={<ProfessionalCategories/>}/>
                        {createRoute(organisation, Organisation)}
                        {createRoute(membership, Membership)}
                        <Route path='about' element={<About/>}/>
                        <Route path='cpd' element={<CPD/>}/>
                        <Route path='login' element={<Form/>}/>
                        <Route path='objective' element={<Objective/>}/>
                        <Route path='development' element={<Development/>}/>
                        <Route path='news' element={<News/>}/>
                        <Route path='readmore' element={<More/>}/>
                    </Route>
                </Routes>
                {dialog && dialog.show && dialog.Component && (
                    <div
                        className='fixed flex items-center justify-center p-4 w-full h-full overflow-hidden  z-40 bg-[rgba(0,0,0,.5)]'>
                        <dialog.Component/>
                    </div>
                )}
                
                {/* Global ChatBot - Available on all pages with highest z-index */}
                <ChatBot />
                
                </UserProvider>

            </GlobalContext.Provider>
        </div>
    );
}

export default App;
