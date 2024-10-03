import React from "react";
import Link from "next/link";

const NavBar = () => {

  const container = `w-full fixed bg-white z-50 shadow-md opacity-90`;
  const navWrap = `container max-w-myr mx-auto flex justify-between py-4`;
  const navList = `flex gap-6 font-extrabold text-lg text-mono-11 hover:text-accent-dark duration-300`;

  return (
    <header className={container}>
      <nav className={navWrap}>
        <Link href="/" passHref>
            마이력서
        </Link> 
        <ul className={navList}>
          <li>
            <Link href="/resume" passHref>
                이력서
            </Link>  
          </li>
          {/* <li>
            <Link href="/coverletter" passHref>
                자기소개서
            </Link>  
          </li>
          <li>
            <Link href="/about" passHref>
                서비스 소개
            </Link>  
          </li> */}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;