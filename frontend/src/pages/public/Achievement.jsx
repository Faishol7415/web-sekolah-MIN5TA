import { Helmet } from 'react-helmet-async';
import { FaTrophy, FaMedal, FaSpinner, FaCalendarAlt, FaUserGraduate, FaAward } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import api, { getFileUrl } from '../../api/axios';

const Achievement = () => {
  const { data: achievements, isLoading, error } = useQuery({
    queryKey: ['public-achievements'],
    queryFn: async () => {
      const response = await api.get('/achievements');
      return response.data.data;
    }
  });



  if (isLoading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 py-32 min-h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 py-32 min-h-screen flex justify-center items-center text-red-500">
        Gagal memuat data prestasi.
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Prestasi | MIN 5 Tulungagung</title>
      </Helmet>
      
      <div className="bg-slate-50 dark:bg-slate-900 py-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
              Prestasi Madrasah
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 dark:text-white mb-4">Prestasi Membanggakan Siswa</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Dedikasi dan kerja keras siswa-siswi MIN 5 Tulungagung dalam mengukir prestasi di berbagai bidang baik akademik maupun non-akademik.</p>
          </div>

          {achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {achievements.map((item) => {
                const imgUrl = item.image 
                  ? getFileUrl(item.image) 
                  : 'https://images.unsplash.com/photo-1567057419565-4349c49d8a04?q=80&w=2072&auto=format&fit=crop';
                  
                const rankText = (item.rank || '').toLowerCase();
                let bgGradient = 'from-primary to-accent';
                let textColor = 'text-accent';
                
                if (rankText.includes('1') || rankText.includes('emas') || rankText.includes('umum')) {
                  bgGradient = 'from-yellow-400 to-amber-600';
                  textColor = 'text-amber-600';
                } else if (rankText.includes('2') || rankText.includes('perak')) {
                  bgGradient = 'from-slate-300 to-slate-500';
                  textColor = 'text-slate-500';
                } else if (rankText.includes('3') || rankText.includes('perunggu')) {
                  bgGradient = 'from-orange-400 to-orange-600';
                  textColor = 'text-orange-600';
                } else if (rankText.includes('harapan')) {
                  bgGradient = 'from-blue-400 to-indigo-600';
                  textColor = 'text-indigo-600';
                }

                return (
                  <div key={item.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={imgUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary-dark dark:text-primary font-bold px-3 py-1 rounded-full text-xs shadow-md">
                        {item.level}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow relative z-10 text-left">
                      <div className={`absolute -top-6 right-6 w-12 h-12 bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800`}>
                        {item.type === 'akademik' ? <FaTrophy className="text-xl drop-shadow-sm" /> : <FaMedal className="text-xl drop-shadow-sm" />}
                      </div>
                      
                      <h3 className="font-heading font-bold text-xl text-slate-800 dark:text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      {item.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 italic">
                          Dengan event : {item.description}
                        </p>
                      )}
                      
                      <div className="mt-auto space-y-2">
                        {item.level && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FaAward className="text-slate-400 min-w-[16px]" />
                            <span className="truncate">Tingkat {item.level}</span>
                          </div>
                        )}
                        {item.participant && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FaUserGraduate className="text-slate-400 min-w-[16px]" />
                            <span className="truncate">{item.participant}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <FaCalendarAlt className="text-slate-400 min-w-[16px]" />
                          <span>
                            {item.date ? new Date(item.date).toLocaleDateString('id-ID') : `Tahun ${item.year}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              Belum ada data prestasi.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Achievement;
