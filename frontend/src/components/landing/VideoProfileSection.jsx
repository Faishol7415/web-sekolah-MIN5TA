import { useState } from 'react';
import { FaPlay, FaYoutube } from 'react-icons/fa';

const VideoProfileSection = ({ profile }) => {
  const [isPlaying, setIsPlaying] = useState(false);

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

  const getVideoId = (url) => {
    if (!url) return null;
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('youtube.com/embed/')) return url.split('youtube.com/embed/')[1].split('?')[0];
    if (url.includes('youtube.com/watch')) {
      try {
        return new URL(url).searchParams.get('v');
      } catch (e) { return null; }
    }
    return null;
  };

  const title = profile?.title || "Mengenal Lebih Dekat MIN 5 Tulungagung";
  // Extract URL and auto-convert to embed format
  const rawUrl = profile?.content?.replace(/(<([^>]+)>)/gi, "").trim();
  const videoUrl = rawUrl ? getEmbedUrl(rawUrl) : "https://www.youtube.com/embed/dSWzm3bfmJk?rel=0";
  const videoId = getVideoId(rawUrl || "https://www.youtube.com/watch?v=dSWzm3bfmJk");

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
            {isPlaying ? (
              /* Full YouTube iframe - only loaded after user clicks play */
              <iframe 
                className="absolute inset-0 w-full h-full"
                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={title} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen>
              </iframe>
            ) : (
              /* YouTube Facade - lightweight thumbnail + play button */
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 w-full h-full cursor-pointer group/play bg-slate-900"
                aria-label={`Putar video: ${title}`}
              >
                {/* YouTube thumbnail */}
                {videoId && (
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/play:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                    width="480"
                    height="360"
                  />
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 group-hover/play:from-black/40 transition-all duration-300" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover/play:scale-110 transition-transform duration-300">
                    <FaPlay className="text-white text-2xl md:text-3xl ml-1" />
                  </div>
                </div>
                {/* Label */}
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <p className="text-white/90 font-bold text-sm md:text-base drop-shadow-lg">Klik untuk memutar video</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoProfileSection;

