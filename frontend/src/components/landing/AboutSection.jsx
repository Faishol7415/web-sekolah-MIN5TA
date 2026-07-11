import { FaQuoteLeft } from 'react-icons/fa';

const AboutSection = ({ profile }) => {
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  
  if (!profile || !profile.is_active) {
    return null; // Do not render anything if the CMS data is empty/inactive
  }

  const imageUrl = profile.image ? (profile.image.startsWith('http') ? profile.image : `${baseUrl}/storage/${profile.image}`) : null;

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image & Graphics */}
          <div className="w-full lg:w-5/12 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10 transition-all duration-500 group-hover:bg-primary/30"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-3d group-hover:shadow-3d-hover z-10 border-[8px] border-white dark:border-slate-800 transition-all duration-500 transform group-hover:-translate-y-2">
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt={profile.title} 
                  className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full text-white transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                <p className="font-heading font-extrabold text-2xl mb-1">{profile.title}</p>
                <p className="text-primary-light font-medium tracking-wide uppercase text-sm">Kepala Madrasah</p>
              </div>
            </div>
            {/* 3D Floating elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-secondary to-orange-400 rounded-2xl -z-20 rotate-12 animate-pulse shadow-lg"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tr from-primary to-accent rounded-full -z-20 opacity-50 shadow-glass"></div>
            {/* Dot pattern */}
            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 -z-10 text-slate-300 dark:text-slate-700 opacity-50">
              <svg width="100" height="100" fill="none" viewBox="0 0 100 100">
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle fill="currentColor" cx="2" cy="2" r="2"></circle>
                </pattern>
                <rect x="0" y="0" width="100" height="100" fill="url(#dots)"></rect>
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-7/12 min-w-0 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light rounded-full text-sm font-bold uppercase tracking-wider border border-primary/20 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                Sambutan Kepala Madrasah
              </div>
              
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png" alt="Kemenag Logo" className="h-6 object-contain" />
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                <div>
                  <p className="font-heading font-bold text-slate-800 dark:text-white text-sm leading-none mb-1">Terakreditasi A</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Unggul & Berprestasi</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-slate-800 dark:text-white mb-8 leading-tight">
              {profile.title}
            </h2>
            
            <div className="relative prose dark:prose-invert max-w-none prose-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:shadow-sm prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-p:text-slate-600 dark:prose-p:text-slate-400 mb-2 break-words overflow-hidden bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-none">
              <FaQuoteLeft className="absolute top-8 left-8 text-primary/10 text-6xl -z-10" />
              <div className="w-full break-words [&_p]:break-words [&_p]:whitespace-pre-line relative z-10" dangerouslySetInnerHTML={{ __html: profile.content }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
