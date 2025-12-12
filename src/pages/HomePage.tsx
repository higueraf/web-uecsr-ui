import { HeroCarousel } from '@/components/home/HeroCarousel';
import { NoticiasPreview } from '@/components/home/NoticiasPreview';
import { EventosPreview } from '@/components/home/EventosPreview';
import { InfoInstitucional } from '@/components/home/InfoInstitucional';
import { useEffect } from 'react';

export const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="space-y-8 md:space-y-12">
      <HeroCarousel />
      <InfoInstitucional />
      <NoticiasPreview />
      <EventosPreview />
    </div>
  );
};