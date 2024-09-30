import React from "react";
import Link from "next/link";

const NavBar = () => {

  const container = `border-b`;
  const navWrap = `container max-w-myr mx-auto flex justify-between py-4`;
  const navList = `flex gap-6`;

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