import { Helmet } from 'react-helmet-async';
import { FaUsers, FaNewspaper, FaImages, FaTrophy, FaArrowUp, FaArrowDown, FaChartLine, FaSpinner } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data;
    }
  });

  const getIconForType = (type) => {
    switch (type) {
      case 'news': return <FaNewspaper />;
      case 'achievement': return <FaTrophy />;
      case 'visitor': return <FaUsers />;
      default: return <FaNewspaper />;
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'news': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'achievement': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'visitor': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  const metrics = data?.metrics || [];
  const recentActivities = data?.recentActivities || [];

  return (
    <>
      <Helmet>
        <title>Dashboard Admin | MIN 5 Tulungagung</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ikhtisar Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Selamat datang kembali, {user?.name}. Berikut adalah ringkasan aktivitas website Anda hari ini.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          Array(3).fill().map((_, i) => (
            <Card key={i} className="p-6 h-[140px] flex items-center justify-center">
              <FaSpinner className="animate-spin text-2xl text-slate-300" />
            </Card>
          ))
        ) : (
          metrics.map((metric) => (
            <Card key={metric.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getColorForType(metric.type)}`}>
                  {getIconForType(metric.type)}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  metric.isPositive 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                    : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {metric.isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                  {metric.trend}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{metric.value}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.title}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area (e.g. Chart placeholder) */}
        <div className="xl:col-span-2">
          <Card className="h-full min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Statistik Pengunjung</h3>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary">
                <option>7 Hari Terakhir</option>
                <option>Bulan Ini</option>
                <option>Tahun Ini</option>
              </select>
            </div>
            
            <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
              <div className="text-center">
                <FaChartLine className="text-slate-300 dark:text-slate-600 text-5xl mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Grafik akan ditampilkan di sini</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Menggunakan Recharts (Integrasi Tahap Berikutnya)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Activity */}
        <div className="xl:col-span-1">
          <Card className="h-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Aktivitas Terakhir</h3>
            
            <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-2xl text-slate-300" /></div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-500">Belum ada aktivitas.</div>
              ) : recentActivities.map((activity) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-primary/20 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 mx-auto">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">{activity.action}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs mb-2">
                      <span className="text-primary font-medium">{activity.target}</span>
                    </div>
                    <div className="text-slate-400 text-[10px] flex items-center gap-2">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!isLoading && (
              <button className="w-full mt-6 py-2 text-sm font-medium text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg transition-colors">
                Lihat Semua Aktivitas
              </button>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
