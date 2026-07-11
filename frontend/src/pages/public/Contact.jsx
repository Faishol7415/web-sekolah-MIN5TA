import { Helmet } from 'react-helmet-async';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaCommentDots } from 'react-icons/fa';
import Button from '../../components/common/Button';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Pelayanan PTSP | MIN 5 Tulungagung</title>
      </Helmet>
      
      <div className="bg-slate-50 dark:bg-slate-900 py-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 dark:text-white mb-4">Pelayanan PTSP</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Pelayanan Terpadu Satu Pintu (PTSP) MIN 5 Tulungagung. Silakan pilih layanan yang Anda butuhkan di bawah ini.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            
            {/* Info Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-4 dark:border-slate-700">Informasi Kontak</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">Alamat</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        <a href="https://maps.app.goo.gl/XcC7T5cH2qeeuXfc6" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          Dusun Pundensari, RT 01 RW 02, Desa/Kecamatan Rejotangan, Kabupaten Tulungagung, Jawa Timur 66293
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                      <FaWhatsapp />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">WhatsApp / Telepon</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">+62 856-4583-2705</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">Email</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">min5tulungagung@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PTSP Services Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Layanan Online</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">Pilih formulir layanan di bawah ini. Anda akan diarahkan ke Google Form untuk mengisi data.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service 1 */}
                  <a 
                    href="https://forms.gle/ZFHULYe3rXzxdEu38" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="h-full p-6 rounded-xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all duration-300">
                      <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                        <FaEnvelope />
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary transition-colors">Permohonan Pelayanan</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Formulir untuk berbagai permohonan layanan administrasi dan akademik (terhubung ke Google Spreadsheet).</p>
                    </div>
                  </a>

                  {/* Service 2 */}
                  <a 
                    href="https://forms.gle/3RpQSESq1HTeL6QX9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="h-full p-6 rounded-xl border-2 border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300">
                      <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                        <FaCommentDots />
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">Quick PTSP (Kritik & Saran)</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Layanan cepat untuk menyampaikan kritik, saran, maupun aduan terkait pelayanan MIN 5 Tulungagung.</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
