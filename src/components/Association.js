// Association.js
import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { useNavigate, useLocation } from 'react-router-dom';
import DeliveringCare from './DeliveringCare';
import ProfessionalPractice from './ProfessionalPractice';
import AdvocacyInHealth from './AdvocacyInHealth';
import MemberBenefits from './MemberBenefits';
import Page from './Page';
import { association } from '../data';

const Association = () => {
  const { findMenu } = useContext(GlobalContext);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [content, setContent] = useState(null);

  useEffect(() => {
    let currentItem = findMenu(association, path);
    if (!currentItem) {
      navigate('/home');
    }

    if (currentItem) {
      if (currentItem.menus) {
        navigate(currentItem.menus[0].link);
      }
      setContent(currentItem);
    }
  }, [path]);

  return (
    <Page>
      <div className="relative flex flex-col w-full h-auto">
        {/* Hero Section */}
        <div className="relative flex flex-col w-full h-[40vh] shrink-0 overflow-x-hidden overflow-y-auto">
          {content && (
            <img
              src={content.image}
              className="flex w-full h-full object-cover overflow-hidden"
            />
          )}
          <div className="absolute flex left-0 top-0 w-full h-full shrink-0 bg-linear-to-b from-[rgba(0,0,0,.8)] via-transparent to-[rgba(0,0,0,.8)]" />
          <div className="absolute flex flex-col justify-end top-[166px] bottom-0 w-full px-[10%]">
            <div className="flex flex-col w-full space-y-4 items-center justify-center mb-8"></div>
            <p className="text-white tracking-wide text-4xl lg:text-7xl font-leBeauneNew">
              {content && content.name}
            </p>
            <div className="flex w-[2px] h-16 border-r border-white" />
          </div>
        </div>

        {/* Content Section */}
        <div className="relative flex flex-col space-y-4 w-full h-auto px-[10%] pb-16 shrink-0 bg-[rgb(243,244,245)]">
          <div className="flex w-[2px] h-24 border-l border-[rgb(204,204,204)]" />
          {content && (
            <div className="flex flex-col space-y-16 w-full h-auto">
              {content.name.toLowerCase().includes('delivering') ? (
                <DeliveringCare />
              ) : content.name.toLowerCase().includes('professional') ? (
                <ProfessionalPractice />
              ) : content.name.toLowerCase().includes('advocacy') ? (
                <AdvocacyInHealth />
              ) : content.name.toLowerCase().includes('training') ? (
                <div className="w-full h-64 text-4xl font-leBeauneNew items-center text-center text-[rgb(85,85,85)]">
                  Coming soon...
                </div>
              ) : content.name.toLowerCase().includes('member') ? (
                <MemberBenefits />
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Footer removed to prevent duplicates */}
    </Page>
  );
};

export default Association;
