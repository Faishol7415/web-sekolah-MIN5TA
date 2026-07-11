import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaQuoteRight, FaStar } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Ahmad Fauzi',
      role: 'Alumni Angkatan 2020 (Mahasiswa UI)',
      content: 'Pendidikan dasar yang saya dapatkan di MIN 5 sangat membentuk karakter islami saya hingga saat ini. Gurunya ramah dan sangat peduli terhadap perkembangan bakat siswa.',
      image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
      id: 2,
      name: 'Siti Aminah',
      role: 'Wali Murid Kelas 5',
      content: 'Fasilitas yang luar biasa dan program tahfidz yang terstruktur membuat saya bangga menyekolahkan anak saya di sini. Kemajuan akhlak anak saya sangat terlihat.',
      image: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
    },
    {
      id: 3,
      name: 'Budi Santoso',
      role: 'Komite Madrasah',
      content: 'MIN 5 Tulungagung terus berinovasi mengikuti perkembangan zaman tanpa meninggalkan akar tradisi pesantren. Sangat direkomendasikan bagi orang tua.',
      image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    {
      id: 4,
      name: 'Rina Wijaya',
      role: 'Alumni Angkatan 2015',
      content: 'Program ekstrakurikuler sains di MIN 5 menjadi cikal bakal minat saya di bidang kedokteran saat ini. Pendekatannya sangat aplikatif dan menyenangkan.',
      image: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 dark:bg-primary/10 rounded-l-full transform translate-x-1/3 -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
            Testimonial
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Dengarkan pengalaman langsung dari alumni, wali murid, dan tokoh masyarakat tentang pendidikan di MIN 5 Tulungagung.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
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
            {testimonials.map((testi) => (
              <SwiperSlide key={testi.id}>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 h-full flex flex-col relative shadow-sm">
                  <FaQuoteRight className="absolute top-8 right-8 text-slate-200 dark:text-slate-800 text-4xl" />
                  
                  <div className="flex text-amber-400 mb-6 gap-1">
                    <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed italic mb-8 flex-grow relative z-10">
                    "{testi.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <img 
                      src={testi.image} 
                      alt={testi.name} 
                      className="w-14 h-14 rounded-full border-2 border-primary object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{testi.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{testi.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
