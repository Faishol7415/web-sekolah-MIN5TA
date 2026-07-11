import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import Card from '../common/Card';

const LatestNewsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['public-latest-posts'],
    queryFn: async () => {
      const response = await api.get('/posts?limit=3');
      return response.data.data;
    }
  });

  const newsList = data || [];

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light rounded-full text-sm font-bold mb-6 uppercase tracking-wider border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              Kabar Terbaru
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-800 dark:text-white">
              Berita & Informasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Madrasah</span>
            </h2>
          </div>
          <Link 
            to="/berita" 
            className="hidden md:flex items-center gap-2 text-primary dark:text-secondary font-medium hover:underline mt-6 md:mt-0"
          >
            Lihat Semua Berita <FaArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Belum ada berita terbaru.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((item) => (
              <div key={item.id} className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-glass hover:shadow-3d-hover transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 dark:border-slate-800 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-64 overflow-hidden p-2">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  {item.category && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-primary-dark text-xs font-extrabold px-4 py-2 rounded-full shadow-lg border border-white/50">
                      {item.category.name}
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-grow relative z-10">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><FaCalendarAlt className="text-primary" /> {formatDate(item.published_at || item.created_at)}</span>
                    <span className="flex items-center gap-1.5"><FaUser className="text-slate-400" /> {item.user?.name || 'Admin'}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 line-clamp-3 flex-grow leading-relaxed">
                    {item.excerpt || item.title}
                  </p>
                  
                  <Link 
                    to={`/berita/${item.slug}`} 
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-4 transition-all mt-auto group/link"
                  >
                    Baca Selengkapnya <FaArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-10 text-center md:hidden">
          <Link 
            to="/berita" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Lihat Semua Berita <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSection;
