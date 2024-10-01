'use client'

import React, { useEffect, useRef, useState } from "react";
import { Logo, Logomark } from "./Logo";
import MenuRight from "./MenuRight";
import { ThemeSelector } from "./ThemeSelector";
import Link from "next/link";
import { MobileNavigation } from "./MobileNavigation";
import clsx from "clsx";
import { usePathname } from "next/navigation";
// import { Tracker } from '@alienkitty/space.js';

const Header = () => {
    const path = usePathname();
    const logoRef = useRef();

    // console.log(path);
    let [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        function onScroll() {
            setIsScrolled(window.scrollY > 0)
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])


    // const tracker = new Tracker({
    //     isVisible: true,
    // });
    // tracker.animateIn()
    // document.body.appendChild(tracker.element);
    // console.log(tracker);
    // useEffect(() => {
    // }, []);


    return (
        <>
            {
                path === '/auth/login' || path === '/auth/register' || path === '/auth/forgot' || path === '/auth/verification' || path === '/auth/newpassword'
                    ?
                    null
                    :
                    <header
                        className={clsx(
                            'sticky top-0 z-50 flex flex-none flex-wrap items-center justify-between bg-white/5 px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 sm:px-6 lg:px-8 dark:shadow-none backdrop-blur-lg',
                            isScrolled
                                ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
                                : 'dark:bg-transparent',
                        )}
                    >
                        <div className="mr-6 flex lg:hidden">
                            <MobileNavigation />
                        </div>
                        <div className="relative flex flex-grow basis-0 items-center">
                            <Link href="/" aria-label="Home page">
                                {/* <Logomark className="h-9 w-9 lg:hidden" /> */}
                                <Logo className="hidden h-9 w-auto fill-slate-700 lg:block dark:fill-sky-100" />
                            </Link>
                        </div>
                        {/* <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div> */}
                        <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow items-center">
                            <ThemeSelector className="relative z-10" />
                            <MenuRight />
                        </div>
                    </header>}
        </>
    );
};

export default Header;
