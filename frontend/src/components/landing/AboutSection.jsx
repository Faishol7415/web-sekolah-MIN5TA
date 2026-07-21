import { FaQuoteLeft, FaStar, FaMedal } from 'react-icons/fa';

import { getFileUrl } from '../../api/axios';

const AboutSection = ({ profile }) => {

  if (!profile || !profile.is_active) return null;

  const imageUrl = profile.image ? getFileUrl(profile.image) : null;

  return (
    <section className="relative py-20 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* ── Background decorations ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-about" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-about)" className="text-slate-900 dark:text-white"/>
        </svg>
      </div>

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8">

        {/* ── Grid layout: 5/12 foto | 7/12 teks ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ═════════════════════════════════
              LEFT — Photo Card (5 kolom)
          ═════════════════════════════════ */}
          <div className="lg:col-span-5">
            <div className="relative group max-w-sm mx-auto lg:mx-0">

              {/* Glow */}
              <div className="absolute inset-4 bg-gradient-to-br from-primary/40 to-accent/30 rounded-[2rem] blur-2xl scale-90 group-hover:scale-100 transition-transform duration-700 opacity-60" />

              {/* Photo frame */}
              <div className="relative z-10 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl transform group-hover:-translate-y-3 transition-transform duration-500">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={profile.title}
                    className="w-full aspect-[3/4] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <FaMedal className="text-9xl text-primary/30" />
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

                {/* Name tag glassmorphism */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
                    <p className="font-heading font-extrabold text-white text-lg leading-snug drop-shadow">{profile.title}</p>
                    <p className="text-primary-light text-xs font-semibold uppercase tracking-widest mt-1">Kepala Madrasah</p>
                  </div>
                </div>
              </div>

              {/* Floating Akreditasi badge */}
              <div className="absolute -top-4 -right-4 z-20 bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 animate-bounce-slow">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <FaStar className="text-white text-xs" />
                </div>
                <div className="leading-none">
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white whitespace-nowrap">Akreditasi A</p>
                  <p className="text-[9px] text-primary font-bold uppercase tracking-wider mt-0.5">Unggul</p>
                </div>
              </div>

              {/* Corner ornament */}
              <div className="absolute -bottom-5 -left-5 z-0 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl rotate-12 opacity-70 shadow-lg" />
            </div>
          </div>

          {/* ═════════════════════════════════
              RIGHT — Content (7 kolom)
          ═════════════════════════════════ */}
          <div className="lg:col-span-7">

            {/* Section label */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border border-primary/20 dark:border-primary/30 text-primary-dark dark:text-primary-light text-xs font-bold uppercase tracking-widest shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                Sambutan Kepala Madrasah
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl xl:text-[2.75rem] leading-tight text-slate-800 dark:text-white mb-3">
              {profile.title}
            </h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent mb-7" />

            {/* Kemenag badge */}
            <div className="inline-flex items-center gap-3 mb-7 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
              <img
                src="/logo-min5.png"
                alt="Kemenag"
                className="h-8 w-8 object-contain flex-shrink-0"
              />
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">Terakreditasi A</p>
                <p className="text-[11px] text-primary font-bold uppercase tracking-wider mt-1">Kemenag RI — Unggul &amp; Berprestasi</p>
              </div>
            </div>

            {/* ── Quote content card ── */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-50/80 dark:bg-slate-800/50">
              {/* Top gradient accent */}
              <div className="h-1 rounded-t-2xl bg-gradient-to-r from-primary via-accent to-secondary" />

              <div className="relative p-6 md:p-8">
                {/* Decorative quote icon */}
                <FaQuoteLeft className="absolute top-4 right-6 text-[5rem] text-primary/[0.06] dark:text-primary/10 pointer-events-none select-none" />

                {/* Actual text content */}
                <div
                  className="relative z-10 text-base text-slate-600 dark:text-slate-300 leading-relaxed text-justify"
                  style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: (profile.content || '').replace(/&nbsp;/g, ' ') }}
                />
              </div>
            </div>

            {/* Footer signature */}
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent" />
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">M5</span>
                </div>
                <span className="text-xs font-medium">MIN 5 Tulungagung</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-slate-200 dark:from-slate-700 to-transparent" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
