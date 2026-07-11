import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import HeroSection from '../../components/landing/HeroSection';
import VideoProfileSection from '../../components/landing/VideoProfileSection';
import AboutSection from '../../components/landing/AboutSection';
import StatsSection from '../../components/landing/StatsSection';
import ProgramsSection from '../../components/landing/ProgramsSection';
import LatestNewsSection from '../../components/landing/LatestNewsSection';
import AchievementSection from '../../components/landing/AchievementSection';
import ContentSection from '../../components/landing/ContentSection';
import { Helmet } from 'react-helmet-async';

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
      <div>
        <HeroSection />
        
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
      </div>
    </>
  );
};

export default Home;
