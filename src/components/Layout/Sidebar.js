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
  Users
} from "lucide-react";
import { MENU_ITEMS } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";

const iconMap = {
  BarChart3: BarChart3,
  Smartphone: Smartphone,
  KeyRound: KeyRound,
  Users: Users
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
          fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">SiteSafe</h1>
          <p className="text-xs text-blue-300 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
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
        <div className="p-4 border-t border-blue-800">
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
