import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import HeroSection from '../../components/landing/HeroSection';
import { Helmet } from 'react-helmet-async';

const VideoProfileSection = lazy(() => import('../../components/landing/VideoProfileSection'));
const AboutSection = lazy(() => import('../../components/landing/AboutSection'));
const StatsSection = lazy(() => import('../../components/landing/StatsSection'));
const ProgramsSection = lazy(() => import('../../components/landing/ProgramsSection'));
const LatestNewsSection = lazy(() => import('../../components/landing/LatestNewsSection'));
const AchievementSection = lazy(() => import('../../components/landing/AchievementSection'));
const ContentSection = lazy(() => import('../../components/landing/ContentSection'));

const Home = () => {
  const { data: profiles = [] } = useQuery({
    queryKey: ['public-profiles'],
    queryFn: async () => {
      try {
        const response = await api.get('/school-profiles');
        return response.data.data;
      } catch (error) {
        return [];
      }
    }
  });

  return (
    <>
      <Helmet>
        <title>Beranda | MIN 5 Tulungagung</title>
        <meta name="description" content="Website resmi MIN 5 Tulungagung. Mewujudkan Generasi Islami, Berprestasi, Berakhlakul Karimah." />
      </Helmet>
      
      {/* Removed container styling to let sections be full width */}
      <div className="overflow-x-hidden w-full">
        <HeroSection />
        
        <Suspense fallback={<div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
          {profiles.map(profile => {
            if (!profile.is_active) return null;
            if (profile.section === 'principal') return <AboutSection key={profile.id} profile={profile} />;
            if (profile.section === 'video') return <VideoProfileSection key={profile.id} profile={profile} />;
            if (profile.section === 'content') return <ContentSection key={profile.id} profile={profile} />;
            return null;
          })}

          <StatsSection />
          <ProgramsSection />
          <LatestNewsSection />
          <AchievementSection />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
