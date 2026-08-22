import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import MinistriesSection from '@/components/MinistriesSection';
import AnnouncementBoard from '@/components/AnnouncementBoard';
import ScheduleSection from '@/components/ScheduleSection';
import GallerySection from '@/components/GallerySection';
import LocationContactSection from '@/components/LocationContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Page Flow */}
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <MinistriesSection />
        <AnnouncementBoard />
        <ScheduleSection />
        <GallerySection />
        <LocationContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
