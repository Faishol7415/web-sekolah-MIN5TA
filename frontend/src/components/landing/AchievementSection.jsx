import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaTrophy, FaMedal, FaCalendarAlt, FaUserGraduate, FaAward } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import api, { getFileUrl } from '../../api/axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const AchievementSection = () => {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['public-achievements'],
    queryFn: async () => {
      const response = await api.get('/achievements');
      return response.data.data;
    }
  });



  // Dummy fallback if no data from API yet for visual testing
  const displayAchievements = achievements && achievements.length > 0 ? achievements : [
    {
      id: 1,
      title: 'Juara 1 Olimpiade Matematika',
      participant: 'Ahmad Fulan',
      level: 'Kabupaten',
      rank: 'Juara 1',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1567057419565-4349c49d8a04?q=80&w=2072&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Juara Harapan 1 Pidato Bahasa Arab',
      participant: 'Siti Aminah',
      level: 'Provinsi',
      rank: 'Juara Harapan 1',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  if (isLoading) {
    return (
      <section className="py-24 bg-white dark:bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 dark:bg-primary/10 rounded-l-full transform translate-x-1/3 -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
            Prestasi Madrasah
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white mb-4">
            Prestasi Membanggakan Siswa
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Dedikasi dan kerja keras siswa-siswi MIN 5 Tulungagung dalam mengukir prestasi di berbagai bidang baik akademik maupun non-akademik.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              }
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            className="pb-16"
          >
            {displayAchievements.map((achievement) => {
              const imgUrl = achievement.image 
                ? getFileUrl(achievement.image) 
                : 'https://images.unsplash.com/photo-1567057419565-4349c49d8a04?q=80&w=2072&auto=format&fit=crop';
              
              const rankText = (achievement.rank || '').toLowerCase();
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
                <SwiperSlide key={achievement.id}>
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={imgUrl} 
                        alt={achievement.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary-dark dark:text-primary font-bold px-3 py-1 rounded-full text-xs shadow-md">
                        {achievement.level}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow relative z-10 text-left">
                      <div className={`absolute -top-6 right-6 w-12 h-12 bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 dark:border-slate-900`}>
                        <FaTrophy className="text-xl drop-shadow-sm" />
                      </div>
                      
                      <h3 className="font-heading font-bold text-xl text-slate-800 dark:text-white mb-2 line-clamp-2">
                        {achievement.title}
                      </h3>
                      
                      {achievement.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 italic">
                          Dengan event : {achievement.description}
                        </p>
                      )}
                      
                      <div className="mt-auto space-y-2">
                        {achievement.level && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FaAward className="text-slate-400 min-w-[16px]" />
                            <span className="truncate">Tingkat {achievement.level}</span>
                          </div>
                        )}
                        {achievement.participant && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <FaUserGraduate className="text-slate-400 min-w-[16px]" />
                            <span className="truncate">{achievement.participant}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <FaCalendarAlt className="text-slate-400 min-w-[16px]" />
                          <span>
                            {achievement.date ? new Date(achievement.date).toLocaleDateString('id-ID') : `Tahun ${achievement.year}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default AchievementSection;
