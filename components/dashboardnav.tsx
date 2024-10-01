"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react";
import type { Session } from "next-auth";

interface Props {
    session: Session,
}

const DashboardNav = ({ session }: Props) => {
    const pathname = usePathname();

    const userLinks = [
        {
            label: 'Settings',
            path: '/dashboard/settings',
            icons: <Settings size={16} />
        },
        {
            label: 'Orders',
            path: '/dashboard/orders',
            icons: <Truck size={16} />
        },
    ] as const;

    const adminLinks = session?.user.role.includes('admin') ? [
        {
            label: 'Analytics',
            path: '/dashboard/analytics',
            icons: <BarChart size={16} />
        },
        {
            label: 'Create',
            path: '/dashboard/addproduct',
            icons: <PenSquare size={16} />
        },
        {
            label: 'Products',
            path: '/dashboard/products',
            icons: <Package size={16} />
        },
    ] as const
        : [];

    const allLinks = [...userLinks, ...adminLinks];
    return (
        <>
            <nav className="py-2 overflow-auto absolute mb-4">
                <ul className="flex gap-6 text-xs font-bold">
                    <AnimatePresence>
                        {allLinks.map((link) => (
                            <motion.li initial={{ scale: 1 }} key={link.path}>
                                <Link
                                    className={cn("flex gap-1 flex-col items-center relative text-sm", pathname === link.path && 'text-amber-500')}
                                    href={link.path}
                                >
                                    {link.icons}
                                    {link.label}
                                    {pathname === link.path ? (
                                        <motion.div
                                            className="h-[2px] w-full rounded-full absolute bg-amber-500 z-0 left-0 -bottom-1"
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            layoutId="underline"
                                            transition={{ type: "spring", stiffness: 35, duration: 0.5 }}
                                        />
                                    ) : null}
                                </Link>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </nav>
        </>
    );
};

export default DashboardNav;
