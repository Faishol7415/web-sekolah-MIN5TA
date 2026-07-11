import { FaQuran, FaLaptopCode, FaMicroscope, FaMedal } from 'react-icons/fa';
import Card from '../common/Card';

const ProgramsSection = () => {
  const programs = [
    {
      id: 1,
      title: 'Bina Prestasi',
      description: 'Program bimbingan intensif untuk siswa berpotensi guna mengikuti berbagai ajang kompetisi dan olimpiade tingkat regional hingga nasional.',
      icon: <FaMedal size={32} />,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      id: 2,
      title: 'Tahfidzul Qur\'an',
      description: 'Program unggulan menghafal Al-Qur\'an dengan metode khusus dan target hafalan terukur yang dipandu oleh asatidz bersanad.',
      icon: <FaQuran size={32} />,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      id: 3,
      title: 'Digital Kids (TIK)',
      description: 'Pengenalan teknologi sejak dini melalui ekstrakurikuler komputer dan pemrograman dasar untuk membangun literasi digital.',
      icon: <FaLaptopCode size={32} />,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      id: 4,
      title: 'Klub Sains Terpadu',
      description: 'Wadah eksperimen dan pembelajaran sains aplikatif untuk melatih nalar kritis dan kemampuan analitis siswa.',
      icon: <FaMicroscope size={32} />,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light rounded-full text-sm font-bold mb-6 uppercase tracking-wider border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Keunggulan Kami
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-800 dark:text-white mb-6">
            Program Unggulan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Madrasah</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl">
            Kami menghadirkan berbagai program unggulan terpadu untuk memaksimalkan kecerdasan spiritual, emosional, dan intelektual peserta didik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-glass hover:shadow-3d-hover transition-all duration-500 transform group-hover:-translate-y-3 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${program.color} transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                  {program.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-primary transition-colors">{program.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
                  {program.description}
                </p>
                <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-8 transition-all duration-500 group-hover:w-24 group-hover:bg-primary"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
