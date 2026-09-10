import { useState } from "react"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import { useSectionNav } from "./useSectionNav"
import { useSiteContent } from "@/context/SiteContentContext"

/** `overHero` = the bar is floating over hero photography, so the icon goes light. */
const MobileMenu = ({ overHero = false }) => {
    const [open, setOpen] = useState(false)
    const { handleNavClick } = useSectionNav()
    const { navLinks } = useSiteContent()

    const onClick = (e, hash) => {
        handleNavClick(e, hash)
        setOpen(false)
    }

    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Menu
                        className={
                            overHero
                                ? "text-(--media-foreground) drop-shadow-md"
                                : "text-foreground"
                        }
                    />
                </SheetTrigger>
                <SheetContent className="bg-background border-none">
                    <div className="flex flex-col gap-6 mt-10 px-7">
                        {(navLinks || []).map((link) => (
                            <a
                                key={link.id ?? link.label}
                                href={`/${link.hash ? `#${link.hash}` : ""}`}
                                onClick={(e) => onClick(e, link.hash)}
                                className="text-foreground text-lg hover:text-(--brand) cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileMenu
