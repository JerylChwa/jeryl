import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Blog", to: "/blog" },
];

const SECTION_LINKS = [
  { label: "Intro", to: "/#intro" },
  { label: "Experience", to: "/#experience" },
  { label: "Projects", to: "/#projects" },
];

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold text-primary">
          Jeryl
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {isHome &&
            SECTION_LINKS.map((link) => (
              <a
                key={link.to}
                href={link.to.replace("/", "")}
                className="text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors hover:text-primary ${
                location.pathname === link.to ? "font-medium text-primary" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
