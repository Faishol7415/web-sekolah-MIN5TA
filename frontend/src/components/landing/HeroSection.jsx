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
                <div className="container mx-auto px-6 md:px-12 pt-28 pb-20 relative h-full flex flex-col justify-center">
                  {/* Floating Circular Element (Top Right) - Modern 3D Minimalist */}
                  <div className="hidden md:flex absolute top-24 right-6 lg:right-12 z-20 group flex-col items-center justify-center w-36 h-36 lg:w-44 lg:h-44 perspective-[1000px]">
                    {/* 3D Shadow Ground */}
                    <div className="absolute -bottom-6 w-24 h-4 bg-black/40 blur-xl rounded-[100%] transition-all duration-500 group-hover:w-20 group-hover:bg-black/20 group-hover:blur-2xl group-hover:translate-y-4"></div>
                    
                    {/* 3D Object */}
                    <div className="relative w-full h-full bg-gradient-to-br from-[#ffffff] to-[#f1f5f9] rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3),inset_0_8px_16px_rgba(255,255,255,1),inset_0_-8px_16px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center transform group-hover:-translate-y-4 group-hover:rotate-y-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] p-4 border border-white/40">
                      
                      {/* Highlight reflection */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-white/90 rounded-[2.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <img 
                        src="/logo-min5.png" 
                        alt="Logo MIN 5" 
                        className="h-12 lg:h-14 w-auto mb-2 relative z-10 drop-shadow-[0_12px_12px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500" 
                        width="48"
                        height="48"
                      />
                      <h3 className="font-extrabold text-xs lg:text-sm text-center leading-tight text-slate-800 relative z-10 drop-shadow-sm">
                        Terakreditasi <span className="text-emerald-500 text-sm lg:text-base font-black">A</span>
                      </h3>
                      <p className="text-slate-500 font-bold text-[7px] lg:text-[8px] mt-1 tracking-[0.2em] uppercase text-center px-1 leading-tight relative z-10">
                        Unggul & Berprestasi
                      </p>
                    </div>
                  </div>

                  <div className="max-w-3xl animate-in slide-in-from-bottom-10 fade-in duration-1000 fill-mode-both z-10 relative">
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
