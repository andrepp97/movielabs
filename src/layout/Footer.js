import Image from "next/image"

const socials = [
    {
        name: "Linkedin",
        icon: "/icons8-linkedin.svg",
        url: "https://www.linkedin.com/in/andreputera",
    },
    {
        name: "Github",
        icon: "/icons8-github.svg",
        url: "https://github.com/andrepp97",
    },
]

const Footer = () => {
    return (
        <footer>
            &copy; 2022 - <strong>Andre Putera Pratama</strong>
            <div className="social">
                {socials.map(social => (
                    <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="nofollow"
                    >
                        <Image
                            width={30}
                            height={30}
                            alt={social.name}
                            src={social.icon}
                        />
                    </a>
                ))}
            </div>
        </footer>
    );
}

export default Footer;