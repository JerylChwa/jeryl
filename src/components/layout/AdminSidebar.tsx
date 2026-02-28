import { NavLink } from "react-router-dom";

const ADMIN_LINKS = [
  { label: "Intro", to: "/admin/intro" },
  { label: "Experience", to: "/admin/experience" },
  { label: "Projects", to: "/admin/projects" },
  { label: "Posts", to: "/admin/posts" },
];

interface AdminSidebarProps {
  onSignOut: () => void;
}

export function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-100 bg-surface">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-bold text-primary">Admin</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {ADMIN_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-muted hover:bg-gray-100 hover:text-primary"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={onSignOut}
          className="w-full rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:bg-gray-100 hover:text-primary"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
