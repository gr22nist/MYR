import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons/IconSet';

const NavBar = () => {
  return (
    <header className='nav-container'>
      <nav className='nav-wrap'>
        <Link href='/' passHref aria-label='홈'>
          <Logo className='nav-logo' />
        </Link> 
        <ul className='nav-list'>
          <li className='nav-item'>
            <Link href='/resume' passHref>
              이력서
            </Link>  
          </li>
          {/* <li className={navBar.navItem}>
            <Link href='/coverletter' passHref>
              자기소개서
            </Link>  
          </li>
          <li className={navBar.navItem}>
            <Link href='/about' passHref>
              서비스 소개
            </Link>  
          </li> */}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;