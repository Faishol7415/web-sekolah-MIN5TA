import { Outlet } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const PublicLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      
      {/* Add top padding for fixed navbar */}
      <main className="flex-grow pt-[80px]">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
