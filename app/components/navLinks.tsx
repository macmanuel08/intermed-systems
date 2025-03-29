'use client';

import {
    HomeIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

const links = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    {
      name: 'Appointments',
      href: '/dashboard/appointments',
      icon: CalendarIcon,
    },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="nav-links">
            {
                links.map(link => {
                    const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'link-item flex text-white',
                                {
                                    'active': pathname === link.href,
                                },
                            )}
                        >
                            <LinkIcon className="link-icon" />
                            <p className="link-text">{link.name}</p>
                        </Link>
                        
                    );
                }
            )}
        </nav>
    );
}