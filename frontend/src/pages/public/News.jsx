import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api, { getFileUrl } from '../../api/axios';
import Card from '../../components/common/Card';

const News = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-posts', page],
    queryFn: async () => {
      const response = await api.get(`/posts?page=${page}`);
      return response.data;
    },
    keepPreviousData: true,
  });

  const newsList = data?.data || [];
  const meta = data?.meta || {};

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop';
    return getFileUrl(path);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Berita | MIN 5 Tulungagung</title>
      </Helmet>
      
      <div className="bg-slate-50 dark:bg-slate-900 py-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 dark:text-white mb-4">Berita & Informasi</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Ikuti kabar terbaru, pengumuman, dan kegiatan seputar madrasah.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500">
              Gagal memuat berita. Silakan coba lagi nanti.
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              Belum ada berita yang diterbitkan.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsList.map((item) => (
                  <Card key={item.id} hover={true} className="p-0 overflow-hidden flex flex-col h-full border-transparent dark:bg-slate-800 shadow-md">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {item.category && (
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          {item.category.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-800">
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1.5"><FaCalendarAlt /> {formatDate(item.published_at || item.created_at)}</span>
                        <span className="flex items-center gap-1.5"><FaUser /> {item.user?.name || 'Admin'}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 hover:text-primary dark:hover:text-secondary transition-colors">
                        <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                        {item.excerpt || item.title}
                      </p>
                      
                      <Link 
                        to={`/berita/${item.slug}`} 
                        className="inline-flex items-center gap-2 text-primary dark:text-secondary font-medium text-sm hover:gap-3 transition-all mt-auto"
                      >
                        Baca Selengkapnya <FaArrowRight size={12} />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>

              {meta.last_page > 1 && (
                <div className="flex justify-center mt-16">
                  <div className="flex gap-2">
                    {Array.from({ length: meta.last_page }).map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${
                          page === i + 1 
                            ? 'bg-primary text-white' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default News;
