import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

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
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const linkClass = (active: boolean) =>
    `transition-colors hover:text-primary dark:hover:text-dark-primary ${
      active ? "font-medium text-primary dark:text-dark-primary" : "text-muted dark:text-dark-muted"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md dark:bg-dark-bg/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 sm:justify-center">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-muted hover:bg-gray-100 dark:text-dark-muted dark:hover:bg-dark-surface sm:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            {open ? (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            )}
          </svg>
        </button>

        {/* Desktop links — centered */}
        <div className="hidden items-center gap-6 text-sm sm:flex">
          {isHome &&
            SECTION_LINKS.map((link) => (
              <a
                key={link.to}
                href={link.to.replace("/", "")}
                className="text-muted transition-colors hover:text-primary dark:text-dark-muted dark:hover:text-dark-primary"
              >
                {link.label}
              </a>
            ))}
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(location.pathname === link.to)}>
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-gray-100 hover:text-primary dark:text-dark-muted dark:hover:bg-dark-surface dark:hover:text-dark-primary"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>

        {/* Theme toggle — mobile, always visible on the right */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-muted hover:bg-gray-100 dark:text-dark-muted dark:hover:bg-dark-surface sm:hidden"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="border-t border-gray-100 px-6 pb-4 dark:border-dark-border sm:hidden">
          <div className="flex flex-col gap-3 pt-3 text-sm">
            {isHome &&
              SECTION_LINKS.map((link) => (
                <a
                  key={link.to}
                  href={link.to.replace("/", "")}
                  onClick={() => setOpen(false)}
                  className="text-muted transition-colors hover:text-primary dark:text-dark-muted dark:hover:text-dark-primary"
                >
                  {link.label}
                </a>
              ))}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={linkClass(location.pathname === link.to)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 1110.07 1.259a.75.75 0 01-.615.745z" clipRule="evenodd" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
    </svg>
  );
}
