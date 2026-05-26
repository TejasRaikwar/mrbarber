import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import {
    Sheet, SheetContent, SheetTrigger
} from "@/components/ui/sheet"
import { navLinks } from './navLinks'

const MobileMenu = () => {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger>
                    <Menu className="text-white" />
                </SheetTrigger>
                <SheetContent className="bg-black border-none">
                    <div className="flex flex-col gap-6 mt-10 px-7">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-white text-lg hover:text-yellow-500"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileMenu
