import Link from 'next/link'
import Image from 'next/image'
import { ImSearch } from 'react-icons/im'
import Logo from '../public/favicon.png'
import styles from '../styles/Navbar.module.css'

const Navbar = () => {
    return (
        <nav className={styles.navbarContainer}>
            <Link href="/" passHref={true}>
                <a className={styles.navbarLogo}>
                    <Image
                        src={Logo}
                        width={30}
                        height={30}
                        className={styles.navbarImg}
                    />
                    <h2>
                        Movieku
                    </h2>
                </a>
            </Link>
            <button className="btn-main">
                <ImSearch />
            </button>
        </nav>
    );
}

export default Navbar;