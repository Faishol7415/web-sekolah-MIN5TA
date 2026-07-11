import { Helmet } from 'react-helmet-async';
import { FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-post', slug],
    queryFn: async () => {
      try {
        const response = await api.get(`/posts/${slug}`);
        return response.data.data;
      } catch (error) {
        if (error.response?.status === 404) {
          navigate('/404', { replace: true });
        }
        throw error;
      }
    },
    retry: false
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen py-16 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Berita Tidak Ditemukan</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Berita yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <Link to="/berita" className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
          Kembali ke Berita
        </Link>
      </div>
    );
  }

  const news = data;

  return (
    <>
      <Helmet>
        <title>{news.title} | MIN 5 Tulungagung</title>
      </Helmet>
      
      <div className="py-16 bg-white dark:bg-slate-950 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="text-sm text-slate-500 mb-6 flex gap-2">
              <Link to="/" className="hover:text-primary">Beranda</Link> / 
              <Link to="/berita" className="hover:text-primary">Berita</Link> / 
              <span className="text-slate-800 dark:text-slate-300 truncate">{news.title}</span>
            </div>

            {news.status === 'draft' && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300 flex items-center gap-3">
                <span className="font-bold">⚠️ Mode Pratinjau Draf:</span>
                Berita ini belum dipublikasikan dan hanya terlihat oleh Anda karena menggunakan tautan pratinjau.
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-800 dark:text-white mb-6 leading-tight">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-8 border-y border-slate-100 dark:border-slate-800 py-4">
              <span className="flex items-center gap-2"><FaCalendarAlt className="text-primary"/> {formatDate(news.published_at || news.created_at)}</span>
              <span className="flex items-center gap-2"><FaUser className="text-primary"/> {news.user?.name || 'Admin'}</span>
              <span className="flex items-center gap-2"><FaTag className="text-primary"/> {news.category?.name || 'Uncategorized'}</span>
            </div>

            <img 
              src={getImageUrl(news.image)} 
              alt={news.title} 
              className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl mb-10 shadow-md"
            />

            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary hover:prose-a:text-accent"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;
