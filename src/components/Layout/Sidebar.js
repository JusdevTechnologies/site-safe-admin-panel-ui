/**
 * Sidebar Component
 * Navigation sidebar for the admin panel
 */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  BarChart3,
  Smartphone,
  KeyRound,
  Users,
  Server,
  BadgeCheck,
  Tablet
} from "lucide-react";
import { MENU_ITEMS, EXTERNAL_LINKS } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const iconMap = {
  BarChart3: BarChart3,
  Smartphone: Smartphone,
  Server: Server,
  KeyRound: KeyRound,
  BadgeCheck: BadgeCheck,
  Users: Users,
  Tablet: Tablet
};

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-blue-900 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transition-transform duration-300 ease-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 p-5 border-b border-blue-800 space-y-3">
          {/* Kokken Robotics Logo */}
          <a
            href={EXTERNAL_LINKS.KOKKEN_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/95 rounded-lg p-2.5 flex items-center justify-center group"
          >
            <img
              src="/logo.png"
              alt="Kokken Robotics"
              className="h-10 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </a>
          {/* SiteSafe Branding */}
          <div>
            <h1 className="text-base font-bold tracking-wide">SiteSafe</h1>
            <p className="text-[10px] text-blue-300/70 mt-0.5">
              Device Management <span className="text-blue-400/30 mx-1">|</span>{" "}
              by Kokken Robotics
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const IconComponent = iconMap[item.icon];
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    active
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }
                `}
              >
                {IconComponent && <IconComponent size={20} />}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="flex-shrink-0 p-4 border-t border-blue-800">
          <div className="text-sm text-blue-100 mb-4">
            <p className="font-medium">{user?.name || "Admin User"}</p>
            <p className="text-xs text-blue-400">
              {user?.email || "admin@sitesafe.com"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 border border-red-400 text-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Kokken Robotics Branding */}
        <div className="flex-shrink-0 px-4 py-2.5 border-t border-blue-800/50 bg-blue-950/20">
          <a
            href={EXTERNAL_LINKS.KOKKEN_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center group"
          >
            <span className="text-[10px] text-white/70 group-hover:text-white/100 transition-colors">
              Kokken Robotics and Consulting Solutions Pvt Ltd
            </span>
          </a>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
