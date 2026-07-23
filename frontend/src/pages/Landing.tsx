import { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './Landing/components/Navbar';
import { Hero } from './Landing/components/Hero';
import { Features } from './Landing/components/Features';
import { WhyElevate } from './Landing/components/WhyElevate';
import { DashboardPreview } from './Landing/components/DashboardPreview';
import { Statistics } from './Landing/components/Statistics';
import { Testimonials } from './Landing/components/Testimonials';
import { FAQ } from './Landing/components/FAQ';
import { Footer } from './Landing/components/Footer';

export const Landing = () => {
  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-mat-green min-h-screen text-cream font-sans selection:bg-cork/30 overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <WhyElevate />
      <DashboardPreview />
      <Statistics />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
};
