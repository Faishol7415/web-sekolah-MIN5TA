import { useState, useEffect } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaTrophy, FaBookOpen } from 'react-icons/fa';

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
};

const StatsSection = () => {
  const stats = [
    { id: 1, title: 'Siswa Aktif', value: 850, icon: <FaUserGraduate />, suffix: '+' },
    { id: 2, title: 'Tenaga Pendidik', value: 45, icon: <FaChalkboardTeacher />, suffix: '' },
    { id: 3, title: 'Prestasi Juara', value: 120, icon: <FaTrophy />, suffix: '+' },
    { id: 4, title: 'Program Ekstra', value: 15, icon: <FaBookOpen />, suffix: '' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-[2rem] transform transition-transform duration-500 group-hover:scale-105 group-hover:bg-white/10"></div>
              <div className="relative p-8 text-center bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-glass transition-all duration-500 transform group-hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center text-white text-4xl mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  {stat.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-2 drop-shadow-md">
                  <CountUp end={stat.value} />{stat.suffix}
                </h3>
                <p className="font-medium text-white/80 uppercase tracking-wider text-sm">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
