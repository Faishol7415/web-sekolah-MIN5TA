import { Helmet } from 'react-helmet-async';
import { FaFilePdf, FaFileWord, FaFileArchive, FaDownload } from 'react-icons/fa';
import Card from '../../components/common/Card';

const Download = () => {
  const files = [
    { id: 1, title: 'Brosur PPDB Tahun Ajaran 2026/2027', category: 'PPDB', size: '2.5 MB', type: 'pdf', downloads: 342 },
    { id: 2, title: 'Formulir Pendaftaran Siswa Baru', category: 'PPDB', size: '1.2 MB', type: 'pdf', downloads: 890 },
    { id: 3, title: 'Kalender Akademik 2025/2026', category: 'Akademik', size: '500 KB', type: 'pdf', downloads: 1205 },
    { id: 4, title: 'Tata Tertib Peserta Didik', category: 'Dokumen', size: '150 KB', type: 'pdf', downloads: 54 },
    { id: 5, title: 'Format Surat Izin Siswa', category: 'Dokumen', size: '25 KB', type: 'doc', downloads: 412 },
    { id: 6, title: 'Materi Sosialisasi Kurikulum Merdeka', category: 'Materi', size: '5.8 MB', type: 'zip', downloads: 89 },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-3xl" />;
      case 'doc': return <FaFileWord className="text-blue-500 text-3xl" />;
      case 'zip': return <FaFileArchive className="text-amber-500 text-3xl" />;
      default: return <FaFilePdf className="text-slate-500 text-3xl" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Download Area | MIN 5 Tulungagung</title>
      </Helmet>
      
      <div className="bg-slate-50 dark:bg-slate-900 py-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 dark:text-white mb-4">Download Area</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Pusat unduhan berbagai dokumen publik, materi pendukung, dan form administrasi madrasah.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Nama File</th>
                    <th className="p-4 font-bold">Kategori</th>
                    <th className="p-4 font-bold">Ukuran</th>
                    <th className="p-4 font-bold">Total Unduh</th>
                    <th className="p-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {files.map((file) => (
                    <tr key={file.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        {getIcon(file.type)}
                        <span className="font-bold">{file.title}</span>
                      </td>
                      <td className="p-4"><span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs">{file.category}</span></td>
                      <td className="p-4 text-sm">{file.size}</td>
                      <td className="p-4 text-sm">{file.downloads} kali</td>
                      <td className="p-4 text-center">
                        <button className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-colors mx-auto">
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Download;
