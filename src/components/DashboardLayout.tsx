'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    FaHome,
    FaUser,
    FaMusic,
    FaCompactDisc,
    FaPlus,
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import { IoChevronDownOutline } from 'react-icons/io5';

const menu = [
    { label: 'Home', icon: <FaHome />, href: '/' },
    {
        label: 'Users',
        icon: <FaUser />,
        href: '/users',
        subLinks: [{ label: 'Add User', icon: <FaPlus />, href: '/addUser' }],
    },
    {
        label: 'Songs',
        icon: <FaMusic />,
        href: '/songs',
        subLinks: [{ label: 'Add Song', icon: <FaPlus />, href: '/addSong' }],
    },
    {
        label: 'Albums',
        icon: <FaCompactDisc />,
        href: '/albums',
        subLinks: [{ label: 'Add Album', icon: <FaPlus />, href: '/addAlbum' }],
    },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSubLinks = (idx: number) => {
        setOpenMenuIdx(openMenuIdx === idx ? null : idx);
    };

    // menu list renderer (shared between mobile & desktop)
    const renderMenu = (isMobile = false) => (
        <ul className="space-y-1 py-2">
            {menu.map((item, idx) => (
                <li key={idx}>
                    {/* Parent menu item */}
                    <div
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-800' : ''
                            }`}
                        onClick={() =>
                            item.subLinks
                                ? toggleSubLinks(idx)
                                : isMobile
                                    ? setMobileOpen(false)
                                    : null
                        }
                    >
                        <Link
                            href={item.href}
                            onClick={() => !item.subLinks && isMobile && setMobileOpen(false)}
                            className="flex items-center gap-2 flex-1"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>

                        {item.subLinks && (
                            <IoChevronDownOutline
                                className={`transition-transform duration-300 ${openMenuIdx === idx ? 'rotate-180' : ''
                                    }`}
                            />
                        )}
                    </div>

                    {/* Sublinks */}
                    {item.subLinks && (
                        <ul
                            className={`bg-gray-800 text-sm overflow-hidden transition-all duration-300 ease-in-out ${openMenuIdx === idx ? 'max-h-40' : 'max-h-0'
                                }`}
                        >
                            {item.subLinks.map((sub, subIdx) => (
                                <li key={subIdx}>
                                    <Link
                                        href={sub.href}
                                        onClick={() => isMobile && setMobileOpen(false)}
                                        className="flex items-center gap-2 px-8 py-2 hover:bg-gray-700"
                                    >
                                        {sub.icon}
                                        {sub.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Mobile topbar */}
            <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between md:hidden">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 focus:outline-none"
                >
                    <FaBars size={22} />
                </button>
                <h1 className="text-lg font-bold">My Dashboard</h1>
                <div />
            </header>

            {/* Desktop SIDEBAR (persistent) */}
            <aside className="hidden md:flex w-60 bg-gray-900 text-white flex-col">
                <div className="p-4 text-lg font-bold border-b border-gray-700">
                    My Dashboard
                </div>
                <nav className="flex-1 overflow-y-auto">{renderMenu(false)}</nav>
            </aside>

            {/* Desktop MAIN */}
            <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>

            {/* MOBILE MENU (overlay drawer) */}
            {mobileOpen && (
                <>
                    {/* Semi-transparent overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Drawer menu */}
                    <aside className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white z-50 shadow-lg transform transition-transform duration-300 translate-x-0">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <span className="font-bold">Menu</span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="text-gray-300 hover:text-white"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto">{renderMenu(true)}</nav>
                    </aside>
                </>
            )}
        </div>
    );
}
