// import { getSessionUser } from "@/server/actions/getSession";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { MouseEventHandler } from "react";

interface Props {
    usuario: Session | undefined;
    sesion: boolean;
    children?: React.ReactNode | undefined | JSX.Element | JSX.Element[]
}

const UserMenu = ({ usuario, sesion }: Props) => {


    const cerrarSesion: MouseEventHandler<HTMLButtonElement> | undefined = async (e) => {
        e.preventDefault();
        await signOut();
    }

    return (
        <>
            {!usuario ? null : <p className="block rounded-md px-3 py-2 text-sm font-medium cursor-default w-full my-2 text-amber-600">{usuario.user?.email}</p>
            }
            {!usuario ? null : <Link href="/dashboard/settings" className="block rounded-md px-3 py-2 text-base md:text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900">Settings</Link>}
            {!usuario ? null : <Link href="" className="block rounded-md px-3 py-2 text-base md:text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900">Orders</Link>}
            {
                sesion ? <button
                    onClick={cerrarSesion}
                    className="block rounded-md px-3 py-2 text-base md:text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full"
                >
                    Log Out
                </button>
                    :
                    <Link
                        href={'/auth/login'}
                        className="block rounded-md px-3 py-2 text-base md:text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                        Sign In
                    </Link>
            }
        </>
    );
};

export default UserMenu;
