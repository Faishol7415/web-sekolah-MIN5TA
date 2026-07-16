import { getFileUrl } from '../../api/axios';

const ContentSection = ({ profile }) => {
  
  if (!profile || !profile.is_active) {
    return null;
  }

  const imageUrl = profile.image ? getFileUrl(profile.image) : null;

  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {profile.title && (
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-800 dark:text-white mb-6">
                {profile.title}
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
            {imageUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg mx-auto max-w-4xl">
                <img 
                  src={imageUrl} 
                  alt={profile.title} 
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}

            <div 
              className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary-dark mx-auto overflow-hidden break-words [&_*]:max-w-full [&_*]:!whitespace-normal [&_table]:w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto"
              dangerouslySetInnerHTML={{ __html: profile.content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
