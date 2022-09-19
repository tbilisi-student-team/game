import React, {ReactNode} from 'react';
import Image from "next/image";

import { Header } from '@/components/Header';

import buddy1 from '@/public/buddy-1.png';
import buddy2 from '@/public/buddy-2-otr.png';

import { DEFAULT_HEADING, DEFAULT_SUBHEADING } from './consts';

export type LayoutProps = {
  children?: ReactNode,
  heading?: string,
  subheading?: string,
}

export const Layout = ({ children, heading = DEFAULT_HEADING, subheading = DEFAULT_SUBHEADING, }: LayoutProps) => (
  <div className="wrapper">
    <Header />

    {heading && (
      <h1>
        {heading}
      </h1>
    )}

    {subheading && (
      <h2>
        {subheading}
      </h2>
    )}

    <div className='main__container'>
      <div className='left-character-wrapper'>
        <Image src={buddy1} alt='Buddy One' className='left-character'/>
      </div>

      {children && (
        <div className='description-layout'>{children}</div>
      )}

      <div className='right-character-wrapper'>
        <Image src={buddy2} alt='Buddy Two' className='right-character' />
      </div>
    </div>
  </div>
);