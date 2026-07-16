import { useState } from 'react';
import { HiMenuAlt2, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getFileUrl } from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors duration-300">
      
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
        >
          <HiMenuAlt2 size={24} />
        </button>
        <div className="hidden md:block">
          <div className="text-sm text-slate-500 font-medium">Selamat Datang,</div>
          <div className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
            {user?.name || 'Administrator'}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        <a 
          href="/" 
          target="_blank" 
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-gradient-to-r from-primary to-accent text-white rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] hover:-translate-y-1 hover:scale-105 active:scale-95 group relative overflow-hidden"
        >
          {/* Shine effect overlay */}
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          
          <span className="relative z-10">Lihat Website</span>
        </a>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden md:block mx-2"></div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {user?.avatar ? (
              <img src={getFileUrl(user.avatar)} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
            ) : (
              <FaUserCircle className="w-8 h-8 text-slate-400" />
            )}
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 z-20 py-1 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link 
                  to="/admin/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <HiOutlineUser /> Profil Saya
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                >
                  <HiOutlineLogout /> Keluar (Logout)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
