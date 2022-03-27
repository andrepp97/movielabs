import Link from "next/link"
import { useRouter } from "next/router"
import { ImSearch } from "react-icons/im"
import styles from "../styles/Navbar.module.css"

const Navbar = () => {
    // Query
    const router = useRouter()

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
            {router.pathname !== "/movies" && (
                <Link href="/movies" passHref={true}>
                    <button className={styles.navbarSearch}>
                        <ImSearch size={18} />
                        <span>Search</span>
                    </button>
                </Link>
            )}
        </nav>
    );
}

export default Navbar;