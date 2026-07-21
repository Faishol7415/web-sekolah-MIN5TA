import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Profil', path: '/profil' },
    { name: 'Berita', path: '/berita' },
    { name: 'Prestasi', path: '/prestasi' },
    { name: 'PMBM', path: 'https://script.google.com/macros/s/AKfycbyOWyUZDaERwzin_6Sk2TcBWg74rBiWd9CaT6kGOrINreP6mEDFT9XBgwkTHo4dUtFcpQ/exec', external: true },
    { name: 'Pelayanan PTSP', path: '/kontak' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-glass border-b border-white/20 dark:border-slate-800/50 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/logo-min5.png" 
            alt="Logo Kemenag" 
            className="w-10 h-10 object-contain drop-shadow-md"
            width="40"
            height="40"
          />
          <div>
            <h1 className="font-heading font-bold text-lg leading-tight dark:text-white text-slate-800">
              MIN 5
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              TULUNGAGUNG
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.external ? (
                  <a 
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-300"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    to={link.path}
                    className={`font-medium transition-colors hover:text-primary ${
                      isActive(link.path) 
                        ? 'text-primary dark:text-secondary' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4 border-l pl-6 dark:border-slate-700">
            <Link 
              to="/admin/login" 
              className="px-6 py-2.5 bg-gradient-to-r from-primary-dark to-primary hover:from-primary hover:to-accent text-white rounded-full font-bold transition-all duration-300 shadow-3d hover:shadow-3d-hover hover:-translate-y-0.5 text-sm"
            >
              Portal Login
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-800 dark:text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t dark:border-slate-800 shadow-xl lg:hidden flex flex-col py-4 px-4 animate-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.external ? (
                  <a 
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg font-medium ${
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 px-4 pt-4 border-t dark:border-slate-800">
            <Link 
              to="/admin/login" 
              className="block w-full text-center py-3 bg-primary text-white rounded-lg font-medium"
            >
              Portal Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
