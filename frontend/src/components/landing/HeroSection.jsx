import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useQuery } from '@tanstack/react-query';
import api, { getFileUrl } from '../../api/axios';

const HeroSection = () => {
  const { data: slides, isLoading } = useQuery({
    queryKey: ['public-sliders'],
    queryFn: async () => {
      const response = await api.get('/sliders');
      return response.data.data;
    }
  });



  // Fallback default slide if no data
  const displaySlides = slides && slides.length > 0 ? slides : [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1584281729004-98ce7e284a1e?q=80&w=2070&auto=format&fit=crop',
      title: 'Selamat Datang di MIN 5 Tulungagung',
      subtitle: 'Mewujudkan Generasi Islami, Berprestasi, Berakhlakul Karimah.',
      button_text: 'Profil Madrasah',
      button_url: '/profil'
    }
  ];

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px]">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        className="w-full h-full"
      >
        {displaySlides.map((slide) => {
          const imgUrl = getFileUrl(slide.image);
          return (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img 
                src={imgUrl} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/70 to-primary-dark/40 flex items-center">
                <div className="container mx-auto px-6 md:px-12 pt-20">
                  <div className="max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in slide-in-from-bottom-10 fade-in duration-1000 fill-mode-both">
                    <div className="md:col-span-8">
                      <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md text-primary-light border border-primary/30 rounded-full text-sm font-bold mb-6 uppercase tracking-wider shadow-lg">
                        Sekolah Berstandar Nasional
                      </div>
                      <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl drop-shadow-md">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {slide.button_text && slide.button_url && (
                          slide.button_url.startsWith('http') ? (
                            <a 
                              href={slide.button_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-primary text-white font-bold rounded-full transition-all duration-300 shadow-3d hover:shadow-3d-hover hover:-translate-y-1"
                            >
                              {slide.button_text}
                            </a>
                          ) : (
                            <Link 
                              to={slide.button_url}
                              className="px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-primary text-white font-bold rounded-full transition-all duration-300 shadow-3d hover:shadow-3d-hover hover:-translate-y-1"
                            >
                              {slide.button_text}
                            </Link>
                          )
                        )}
                        {slide.button2_text && slide.button2_url && (
                          slide.button2_url.startsWith('#') ? (
                            <button 
                              onClick={() => {
                                const elementId = slide.button2_url.replace('#', '');
                                const element = document.getElementById(elementId);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-glass"
                            >
                              {slide.button2_text}
                            </button>
                          ) : slide.button2_url.startsWith('http') ? (
                            <a 
                              href={slide.button2_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-glass"
                            >
                              {slide.button2_text}
                            </a>
                          ) : (
                            <Link 
                              to={slide.button2_url}
                              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-full transition-all duration-300 border border-white/20 hover:border-white/40 shadow-glass"
                            >
                              {slide.button2_text}
                            </Link>
                          )
                        )}
                      </div>
                    </div>

                    {/* 3D Floating Element (Glowing & Better) */}
                    <div className="hidden md:block md:col-span-4 relative group">
                      {/* Aura Menyala */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary via-emerald-400 to-accent opacity-60 blur-[60px] rounded-full group-hover:opacity-80 transition-opacity duration-700 animate-pulse"></div>
                      
                      {/* Kartu Kaca (Glassmorphism) */}
                      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/40 p-10 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.2)] transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500">
                        {/* Efek Kilau Dalam */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
                        
                        <div className="text-center relative z-10">
                          <img 
                            src="/logo-min5.png" 
                            alt="Kemenag" 
                            className="h-24 mx-auto mb-5 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-500" 
                          />
                          <h3 className="font-extrabold text-2xl mb-1 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 drop-shadow-[0_2px_15px_rgba(253,224,71,0.6)]">
                            Terakreditasi A
                          </h3>
                          <p className="text-white/90 font-medium tracking-widest uppercase text-xs mt-2 drop-shadow-md">
                            Unggul & Berprestasi
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>
      
      {/* Curved bottom separator */}
      <div className="absolute bottom-0 w-full z-10 text-slate-50 dark:text-slate-900 transform translate-y-px">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-current" preserveAspectRatio="none">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
