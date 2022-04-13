import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { ImSearch, ImTv, ImFilm } from "react-icons/im"
import { RiMenu4Fill, RiCloseFill } from "react-icons/ri"
import styles from "../styles/Navbar.module.css"

const links = [
    {
        name: "Movies",
        url: "/movies",
        icon: <ImFilm size={18} />,
    },
    {
        name: "TV Shows",
        url: "/tv",
        icon: <ImTv size={18} />,
    },
    {
        name: "Search",
        url: "/search",
        icon: <ImSearch size={18} />,
    },
]

const Navbar = () => {
    // Query
    const router = useRouter()

    // State
    const [open, setOpen] = useState(false)

    // Render
    return (
        <nav className={styles.navbarContainer}>
            <Link href="/" passHref={true}>
                <a className={styles.navbarLogo}>
                    <h2>
                        Movieku
                    </h2>
                </a>
            </Link>
            <div className={styles.navbarLinks} style={open ? { right: 0 } : {}}>
                {links.map(link => (
                    <Link
                        href={link.url}
                        passHref={true}
                        key={link.name}
                    >
                        <button
                            className={styles.navbarLink}
                            onClick={() => setOpen(false)}
                            style={router.pathname == link.url ? { background: "#552d9e" } : {}}
                        >
                            {link.icon}
                            <span>
                                {link.name}
                            </span>
                        </button>
                    </Link>
                ))}
            </div>
            {
                open
                    ? (
                        <RiCloseFill
                            size={28}
                            color="#F5F5F5"
                            className={styles.menu}
                            onClick={() => setOpen(false)}
                        />
                    )
                    : (
                        <RiMenu4Fill
                            size={28}
                            className={styles.menu}
                            onClick={() => setOpen(true)}
                        />
                    )
            }
        </nav>
    );
}

export default Navbar;