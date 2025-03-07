"use client";

import Button from "@/components/basic/button";
import Discord from "@/components/basic/icons/discord";
import Menu from "@/components/basic/icons/menu";
import Telegram from "@/components/basic/icons/telegram";
import Logo from "@/components/basic/logo";
import { AppContext } from "@/context/context";
import { useContext, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { BaseContext } from '@/context/BaseContext'

export default function Header() {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(
      headerRef.current,
      {
        y: -100,
      },
      {
        y: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <header ref={headerRef} className="bg-main flex justify-center lg:px-24 p-4">
      <div className="w-full max-w-container flex justify-between items-center">
        <Logo />
        {/* <MenuList /> */}
        <ToolKit />
      </div>
    </header>
  );
}

// const MenuList = () => {
//   return (
//     <ul className="text-white gap-10 hidden md:flex">
//         <li><a target="_blank" className="hover:text-primary" href="https://gambly-litepaper.gitbook.io" target="_blank">Litepaper</a></li>
//         <li><a target="_blank" className="hover:text-primary" href="https://gambly-litepaper.gitbook.io/untitled/info/tokenomics">Tokenomics</a></li>
//         <li><a target="_blank" className="hover:text-primary" href="https://gambly-litepaper.gitbook.io/untitled/info/terms-and-conditions">Terms</a></li>
//     </ul>
//   );
// };

const ToolKit = () => {
  const { toggleFeatureFlag } = useContext(AppContext);
  const { network } = useContext(BaseContext)

  return (
    <div className="flex items-center gap-5">
      <Button href={`casinos`} className="hidden hover:opacity-75 hover:animate-pulse transition-all md:flex">Browse Casinos</Button>
      <Menu
        onClick={() => toggleFeatureFlag("isOpenMenu")}
        className="flex md:hidden"
      />
      <Discord />
      <Telegram />
    </div>
  );
};
