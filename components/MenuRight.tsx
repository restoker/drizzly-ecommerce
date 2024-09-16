// import { auth } from "@/server/auth";
"use client";
import { Menu, MenuButton, MenuItems, Popover, PopoverPanel } from "@headlessui/react";
import { MagnifyingGlassIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import UserMenu from "./UserMenu";
import { searchStore } from "@/store/searchStore";
import { useEffect, useState } from "react";
import { getSessionUser } from "@/server/actions/getSession";
import type { Session } from "next-auth";

const user = {
    name: 'Chelsea Hagon',
    email: 'chelsea.hagon@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

// const userNavigation = [
//     { name: 'Your Profile', href: '#' },
//     { name: 'Settings', href: '#' },
//     { name: 'Sign out', href: '#' },
// ]

const MenuRight = () => {

    const handleOpen = searchStore(state => state.handleOpen);

    const [sesion, setSesion] = useState(false);
    const [usuario, setUsuario] = useState<Session | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const session = await getSessionUser();
            // console.log(session);
            if (session.ok) {
                setUsuario(session.session);
                setSesion(session.ok);
            }
        })()
    }, []);

    const toggleSearchBar = () => {
        handleOpen();
    }

    return (
        <div className="relative flex basis-0 justify-end gap-6 sm:gap-8">
            <Popover
                as="header"
                className="bg-transparent shadow-sm data-[open]:fixed data-[open]:inset-0 data-[open]:z-40 data-[open]:overflow-y-auto lg:static lg:overflow-y-visible data-[open]:lg:static data-[open]:lg:overflow-y-visible"

            >
                <div className="">
                    <div className="relative flex justify-between gap-3 lg:gap-8">
                        <button
                            type="button"
                            className="relative ml-5 flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-200"
                        >
                            <ShoppingBagIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                        <button
                            type="button"
                            className="relative mr-5 flex-shrink-0 rounded-full bg-transparent text-gray-400 hover:text-gray-200"
                            onClick={toggleSearchBar}

                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Search</span>
                            <MagnifyingGlassIcon
                                aria-hidden="true"
                                className="h-6 w-6"
                            />
                        </button>
                        <div className="hidden lg:flex lg:justify-end xl:col-span-4">
                            {/* Profile dropdown */}

                            <Menu as="div" className="relative ml-5 flex-shrink-0">
                                <div>
                                    <MenuButton className="relative flex rounded-full focus:outline-none">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        {usuario?.user?.image ? <img alt="" src={usuario?.user?.image} className="h-8 w-8 rounded-full" /> : <img src="/img/avatar.png" alt="" className="h-8 w-8 rounded-full object-cover" />}
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white backdrop-blur-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in text-base!"
                                >
                                    {/* <div className="flex justify-start my-3 text-ellipsis line-clamp-1 mx-2  overflow-hidden">
                                        <div className="text-sm font-medium text-gray-500 ">{user.email}</div>
                                    </div> */}

                                    <UserMenu usuario={usuario} sesion={sesion} />


                                    {/* <MenuItem key={item.name}>
                                            <a href={item.href} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                                {item.name}
                                            </a>
                                        </MenuItem> */}

                                </MenuItems>
                            </Menu>
                            {/* <a
                                href="#"
                                className="ml-6 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                New Project
                            </a> */}
                        </div>
                    </div>
                </div>

                {/* <PopoverPanel as="nav" aria-label="Global" className="lg:hidden">
                    <div className="mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pb-3 pt-4">
                        <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                            <div className="flex-shrink-0">
                                <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            </div>
                            <button
                                type="button"
                                className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">View notifications</span>
                                <BellIcon aria-hidden="true" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                            {userNavigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </PopoverPanel> */}
            </Popover>
        </div>
    );
};

export default MenuRight;
