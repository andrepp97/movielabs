import Image from "next/image";

const socials = [
  {
    name: "Portfolio",
    icon: "/globe.svg",
    url: "https://andrepp.vercel.app/",
  },
  {
    name: "LinkedIn",
    icon: "/icons8-linkedin.svg",
    url: "https://www.linkedin.com/in/andreputera",
  },
  {
    name: "GitHub",
    icon: "/icons8-github.svg",
    url: "https://github.com/andrepp97",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="container">
      <div className="divider" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        {/* Copyright Attribution */}
        <div className="copyright" style={{ color: "#4b5563", fontSize: "0.95rem" }}>
          <strong>&copy; {currentYear}</strong> - Andre Putera Pratama
        </div>

        {/* Semantic Accessible Social Nav Links */}
        <nav className="social" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                social.name === "Portfolio"
                  ? "Visit Andre's portfolio website"
                  : `Visit Andre's ${social.name} profile`
              }
              style={{
                display: "inline-flex",
                transition: "transform 0.2s ease, opacity 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <Image
                width={24}
                height={24}
                alt={`${social.name} Icon`}
                loading="lazy"
                src={social.icon}
              />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;