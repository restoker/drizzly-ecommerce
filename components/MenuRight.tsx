// import { auth } from "@/server/auth";
"use client";
import { Popover } from "@headlessui/react";
import { MagnifyingGlassIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
// import UserMenu from "./UserMenu";
import { searchStore } from "@/store/searchStore";
import { useEffect, useState } from "react";
import { getSessionUser } from "@/server/actions/getSession";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,

} from "./ui/dropdown-menu";
import Image from "next/image";
import { LogIn, LogOut, Settings, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";

const MenuRight = () => {

    const handleOpen = searchStore(state => state.handleOpen);
    const router = useRouter();
    const [sesion, setSesion] = useState(false);
    // const [usuario, setUsuario] = useState<Session | undefined>(undefined);
    const [user, setUser] = useState<Session | undefined>(undefined);


    useEffect(() => {
        (async () => {
            const session = await getSessionUser();
            // console.log(session);
            if (session.ok) {
                setUser(session.session);
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
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-full">
                                    <Avatar className="w-8 h-8 rounded-full">
                                        {user?.user.image && (
                                            <img alt="" src={user?.user?.image} className="h-8 w-8 rounded-full" />
                                        )}
                                        {!user?.user.image && (
                                            <AvatarFallback className="bg-primary/25">
                                                {/* <div className="font-bold">
                                                    {user?.user.name?.charAt(0).toUpperCase()}
                                                </div> */}
                                                <img src="/img/avatar.png" alt="" className="h-8 w-8 rounded-full object-cover" />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 p-6" align="end">
                                    {user?.user ? <div className="mb-4 p-4 flex flex-col gap-1 items-center rounded-lg  bg-primary/10">
                                        {user?.user.image && (
                                            <Image
                                                src={user.user.image}
                                                alt={user.user.name!}
                                                className="rounded-full"
                                                width={36}
                                                height={36}
                                            />
                                        )}
                                        <p className="font-bold text-xs">{user?.user.name}</p>
                                        <span className="text-xs font-medium text-secondary-foreground">
                                            {user?.user.email}
                                        </span>
                                    </div> : null}
                                    <DropdownMenuSeparator />

                                    {user?.user ? <DropdownMenuItem
                                        onClick={() => router.push("/dashboard/orders")}
                                        className="group py-2 font-medium cursor-pointer "
                                    >
                                        <TruckIcon
                                            size={14}
                                            className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
                                        />{" "}
                                        My orders
                                    </DropdownMenuItem> : null}

                                    {user?.user ? <DropdownMenuItem
                                        onClick={() => router.push("/dashboard/settings")}
                                        className="group py-2 font-medium cursor-pointer  ease-in-out "
                                    >
                                        <Settings
                                            size={14}
                                            className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
                                        />
                                        Settings
                                    </DropdownMenuItem> : null}

                                    {user?.user
                                        ?
                                        <DropdownMenuItem
                                            onClick={() => signOut()}
                                            className="py-2 group focus:bg-destructive/30 font-medium cursor-pointer "
                                        >
                                            <LogOut
                                                size={14}
                                                className="mr-3  group-hover:scale-75 transition-all duration-300 ease-in-out"
                                            />
                                            Sign out
                                        </DropdownMenuItem>
                                        :
                                        <DropdownMenuItem
                                            onClick={() => router.push('/auth/login')}
                                            className="py-2 group focus:bg-amber-500/50 font-medium cursor-pointer "
                                        >
                                            <LogIn
                                                size={14}
                                                className="mr-3  group-hover:scale-75 transition-all duration-300 ease-in-out"
                                            />
                                            Log In
                                        </DropdownMenuItem>
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* <UserMenu usuario={usuario} sesion={sesion} /> */}
                        </div>
                    </div>
                </div >
            </Popover >
        </div >
    );
};

export default MenuRight;
