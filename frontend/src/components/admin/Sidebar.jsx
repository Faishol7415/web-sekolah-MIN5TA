import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, FaNewspaper, FaTags, FaTrophy, 
  FaImages, FaCog, FaUsers, FaChartLine, FaBuilding 
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { title: 'Kelola Beranda', path: '/admin/profil', icon: <FaBuilding /> },
    { title: 'Slider & Banner', path: '/admin/sliders', icon: <FaImages /> },
    { title: 'Berita & Artikel', path: '/admin/berita', icon: <FaNewspaper /> },
    { title: 'Kategori', path: '/admin/kategori', icon: <FaTags /> },
    { title: 'Prestasi', path: '/admin/prestasi', icon: <FaTrophy /> },
    { title: 'Manajemen Pengguna', path: '/admin/users', icon: <FaUsers /> },
    { title: 'Log Aktivitas', path: '/admin/activity', icon: <FaChartLine /> },
    { title: 'Pengaturan Web', path: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            M5
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-white leading-tight">MIN 5 CMS</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)] p-4 no-scrollbar">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Menu Utama
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.title}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 px-3 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Versi Aplikasi</div>
            <div className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">v1.0.0-beta</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
