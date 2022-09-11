
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../UI/Header';

import buddy1 from '../../assets/buddy-1.png';
import buddy2 from '../../assets/buddy-2-otr.png';

export const Layout = () => (
  <div className="wrapper">
    <Header />
    <h1>
      Pew!
    </h1>
    <h2>
      Study project of Tbilisi Team
    </h2>
    <div className='main__container'>
    <div className='left-character-wrapper'>
          <img src={buddy1} alt='Buddy One' className='left-character'/>
        </div>
    <div className='description-layout'><Outlet /></div>
    <div className='right-character-wrapper'>
          <img src={buddy2} alt='Buddy Two' className='right-character' />
        </div>
        </div>
  </div>
);
