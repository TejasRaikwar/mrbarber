import React from 'react'
import { Link} from "react-router-dom"
import { navLinks } from "./navLinks"

const Navlinks = () => {
    return (
        <div className="hidden md:flex items-center gap-8">
            {
                navLinks.map((link)=>(
                    <Link
                       key={link.path}
                       to={link.path}
                       className="text-white hover:text-yellow-500  transition-all duration-300"
                    >
                        {link.label}
                    </Link>
                ))
            }
        </div>
    )
}

export default Navlinks
