import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HospitalitySection from '@/components/HospitalitySection';
import AboutSection from '@/components/AboutSection';
import MinistriesSection from '@/components/MinistriesSection';
import SermonsSection from '@/components/SermonsSection';
import AnnouncementBoard from '@/components/AnnouncementBoard';
import ScheduleSection from '@/components/ScheduleSection';
import MinistryRegistrationSection from '@/components/MinistryRegistrationSection';
import GivingSection from '@/components/GivingSection';
import GallerySection from '@/components/GallerySection';
import LocationContactSection from '@/components/LocationContactSection';
import Footer from '@/components/Footer';

export default function PublicPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141715] text-[#1E2320] dark:text-[#EDEAE4] transition-colors">
      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Page Flow */}
      <main className="flex-1">
        <Hero />
        <HospitalitySection />
        <AboutSection />
        <MinistriesSection />
        <SermonsSection />
        <AnnouncementBoard />
        <ScheduleSection />
        <MinistryRegistrationSection />
        <GivingSection />
        <GallerySection />
        <LocationContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
