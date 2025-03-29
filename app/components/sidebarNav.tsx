import Link from "next/link";
import LogoutButton from "./logoutButton";
import BusinessLogo from "./businessLogo";
import NavLinks from "./navLinks";

export default function SidebarNav() {
    return (
        <div className="sidebar bg-primary">
            <header>
                <Link href="/">
                    <BusinessLogo />
                </Link>
            </header>
            
           <NavLinks />

            <footer>
                <LogoutButton />
            </footer>
        </div>
    )
}