'use client';

import { useState } from 'react';
import Navbar from '@/components/barbershop/Navbar';
import HeroSection from '@/components/barbershop/HeroSection';
import ServicesSection from '@/components/barbershop/ServicesSection';
import GallerySection from '@/components/barbershop/GallerySection';
import TeamSection from '@/components/barbershop/TeamSection';
import TestimonialsSection from '@/components/barbershop/TestimonialsSection';
import ContactSection from '@/components/barbershop/ContactSection';
import Footer from '@/components/barbershop/Footer';
import FloatingWhatsApp from '@/components/barbershop/FloatingWhatsApp';
import FloatingBookButton from '@/components/barbershop/FloatingBookButton';
import BookingDialog from '@/components/barbershop/BookingDialog';

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <>
      <Navbar onBook={openBooking} />
      <main>
        <HeroSection onBook={openBooking} />
        <ServicesSection onBook={openBooking} />
        <GallerySection />
        <TeamSection onBook={openBooking} />
        <TestimonialsSection />
        <ContactSection onBook={openBooking} />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingBookButton onBook={openBooking} />
      <BookingDialog open={bookingOpen} onClose={closeBooking} />
    </>
  );
}
