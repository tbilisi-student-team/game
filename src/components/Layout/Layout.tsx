import React, {ReactNode} from 'react';
import Image from "next/image";
import { Header } from '@/components/Header';

import buddy1 from '@/public/buddy-1.png';
import buddy2 from '@/public/buddy-2-otr.png';

type LayoutProps = {
    children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
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
        <Image src={buddy1} alt='Buddy One' className='left-character'/>
      </div>
      <div className='description-layout'>{children}</div>
      <div className='right-character-wrapper'>
        <Image src={buddy2} alt='Buddy Two' className='right-character' />
      </div>
    </div>
  </div>
);
