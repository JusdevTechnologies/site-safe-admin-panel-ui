/**
 * Main Layout Component
 * Main layout wrapper for authenticated pages
 */
import Header from './Header';
import Sidebar from './Sidebar';

function MainLayout({ children, title }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {title && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
