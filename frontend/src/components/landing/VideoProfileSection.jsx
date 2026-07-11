import { FaPlay, FaYoutube } from 'react-icons/fa';

const VideoProfileSection = ({ profile }) => {

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      } catch (e) {
        // Fallback
      }
    }
    return url;
  };

  const title = profile?.title || "Mengenal Lebih Dekat MIN 5 Tulungagung";
  // Extract URL and auto-convert to embed format
  const rawUrl = profile?.content?.replace(/(<([^>]+)>)/gi, "").trim();
  const videoUrl = rawUrl ? getEmbedUrl(rawUrl) : "https://www.youtube.com/embed/dSWzm3bfmJk?rel=0";

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary-dark dark:text-primary-light rounded-full text-sm font-bold mb-4 uppercase tracking-wide">
            <FaYoutube className="text-red-500 text-lg" /> Profil Madrasah
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Saksikan video profil kami untuk melihat secara langsung fasilitas, kegiatan belajar mengajar, dan lingkungan yang mendukung perkembangan peserta didik di MIN 5 Tulungagung.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 aspect-video group bg-slate-800 flex items-center justify-center">
            {/* Embedded YouTube Video */}
            {videoUrl.includes('http') ? (
              <iframe 
                className="absolute inset-0 w-full h-full"
                src={videoUrl} 
                title={title} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen>
              </iframe>
            ) : (
              <div className="text-white/50 flex flex-col items-center">
                <FaYoutube className="text-6xl mb-4 text-red-500/50" />
                <p>URL Video tidak valid. Silakan atur di CMS.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoProfileSection;
