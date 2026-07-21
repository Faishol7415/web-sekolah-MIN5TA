import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-8 relative overflow-hidden">
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-dark via-primary to-accent"></div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg border border-primary/20">
                <img 
                  src="/logo-min5.png" 
                  alt="Logo Kemenag" 
                  className="w-full h-full object-contain drop-shadow-sm"
                  width="40"
                  height="40"
                />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-white">MIN 5</h2>
                <p className="text-xs text-primary-light font-bold tracking-widest uppercase">Tulungagung</p>
              </div>
            </div>
            <p className="mb-8 leading-relaxed text-slate-400">
              Mewujudkan Generasi Islami, Berprestasi, Berakhlakul Karimah. Menjadi lembaga pendidikan dasar unggul di Kabupaten Tulungagung.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/min5tulungagung?locale=id_ID" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-3d hover:-translate-y-1 border border-slate-700 hover:border-transparent">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/min5tulungagung/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-3d hover:-translate-y-1 border border-slate-700 hover:border-transparent">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.youtube.com/@min5tulungagung673" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-3d hover:-translate-y-1 border border-slate-700 hover:border-transparent">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/profil" className="hover:text-primary transition-all flex items-center gap-3 group"><span className="text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-transform">▶</span> Profil Madrasah</Link></li>
              <li><Link to="/berita" className="hover:text-primary transition-all flex items-center gap-3 group"><span className="text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-transform">▶</span> Berita Terbaru</Link></li>
              <li><Link to="/prestasi" className="hover:text-primary transition-all flex items-center gap-3 group"><span className="text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-transform">▶</span> Prestasi Siswa</Link></li>
              <li><Link to="/kontak" className="hover:text-primary transition-all flex items-center gap-3 group"><span className="text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-transform">▶</span> Pelayanan PTSP</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></span>
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <FaMapMarkerAlt className="text-primary" size={16} />
                </div>
                <a href="https://maps.app.goo.gl/XcC7T5cH2qeeuXfc6" target="_blank" rel="noopener noreferrer" className="text-sm leading-relaxed text-slate-400 group-hover:text-primary transition-colors">
                  Dusun Pundensari, RT 01 RW 02, Desa/Kecamatan Rejotangan, Kabupaten Tulungagung, Jawa Timur 66293
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <FaPhone className="text-primary" size={16} />
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">+62 856-4583-2705</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <FaEnvelope className="text-primary" size={16} />
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">min5tulungagung@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Map */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
              Peta Lokasi
              <span className="absolute -bottom-3 left-0 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></span>
            </h3>
            <div className="w-full h-48 bg-slate-800 p-2 rounded-2xl overflow-hidden shadow-lg border border-slate-700 hover:border-primary/50 transition-colors">
              <iframe 
                src="https://maps.google.com/maps?q=MIN%205%20Tulungagung,%20Rejotangan&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '0.75rem' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi MIN 5 Tulungagung"
              ></iframe>
            </div>
          </div>
          
        </div>
        
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} MIN 5 Tulungagung. All rights reserved.
          </p>
          <div className="text-sm text-slate-500 flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
            Made with <span className="text-red-500 animate-pulse">♥</span> by faishol_ack
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
