"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function GlobalShell() {
    const pathname = usePathname();

    // Don't show Navbar or global background spots on the coming-soon page
    if (pathname === '/') {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="bg-gradient-spot bg-spot-1"></div>
            <div className="bg-gradient-spot bg-spot-2"></div>
        </>
    );
}
