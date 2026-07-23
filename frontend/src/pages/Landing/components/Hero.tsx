import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Book, Pencil, GraduationCap, Coffee } from 'lucide-react';

export const Hero = () => {
  const { scrollY } = useScroll();

  // Coin Toss Interpolations:
  // Directly tied to native scrollY for instant, 500fps-like fluid responsiveness
  const coinY = useTransform(scrollY, [0, 800], [0, 1200]);
  const coinRotateX = useTransform(scrollY, [0, 800], [0, -1080]);
  const coinScale = useTransform(scrollY, [0, 400, 800], [1, 1.1, 0.5]);
  const coinOpacity = useTransform(scrollY, [0, 500, 750], [1, 1, 0]); // Fades out completely

  // Study items scatter interpolations:
  const item1Y = useTransform(scrollY, [0, 800], [0, -600]);
  const item1X = useTransform(scrollY, [0, 800], [0, -300]);
  const item1Rotate = useTransform(scrollY, [0, 800], [-15, -180]);

  const item2Y = useTransform(scrollY, [0, 800], [0, -750]);
  const item2X = useTransform(scrollY, [0, 800], [0, 100]);
  const item2Rotate = useTransform(scrollY, [0, 800], [10, 220]);

  const item3Y = useTransform(scrollY, [0, 800], [0, -500]);
  const item3X = useTransform(scrollY, [0, 800], [0, 350]);
  const item3Rotate = useTransform(scrollY, [0, 800], [45, 300]);

  const item4Y = useTransform(scrollY, [0, 800], [0, -650]);
  const item4X = useTransform(scrollY, [0, 800], [0, -150]);
  const item4Rotate = useTransform(scrollY, [0, 800], [-30, -90]);

  const itemsOpacity = useTransform(scrollY, [0, 300, 600], [1, 1, 0]);
  const itemsScale = useTransform(scrollY, [0, 400], [1, 0.5]);

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-x-clip bg-mat-green pt-20" style={{ perspective: '1000px' }}>
      {/* Vignette effect for realism */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-0 pointer-events-none" />
      
      {/* Background grid representing cutting mat */}
      <div className="absolute inset-0 opacity-20 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(245,236,217,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,236,217,0.4) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative z-10 w-full h-full flex flex-col justify-center">
        
        {/* Top left overhead text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-24 md:top-28 lg:top-24 left-6 md:left-24 z-20"
        >
          <p className="text-cream text-[10px] md:text-xs lg:text-sm font-bold tracking-widest uppercase">
            MADE FOR STUDENTS. BUILT FOR LEARNING.
          </p>
        </motion.div>

        {/* Massive overlapping text */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[22vw] md:text-[18vw] leading-none font-bold text-cream select-none opacity-90 absolute top-[20%] md:top-[12%] left-0 md:left-12 z-30 w-full whitespace-nowrap pointer-events-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ELEVATE
        </motion.h1>

        {/* Floating circular cork-like element (mimics coaster/coin) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateZ: -10 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          style={{ 
            y: coinY, 
            rotateX: coinRotateX,
            scale: coinScale,
            opacity: coinOpacity
          }}
          className="absolute top-[45%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[450px] md:h-[450px] rounded-full bg-cork shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center border-8 md:border-[16px] border-cork-dark overflow-hidden"
        >
          {/* Subtle noise instead of expensive SVG filter */}
          <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none"></div>
        </motion.div>

        {/* Floating study items that toss upwards */}
        <div className="absolute top-[45%] md:top-[45%] left-1/2 z-20 pointer-events-none w-0 h-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ y: item1Y, x: item1X, rotateZ: item1Rotate, opacity: itemsOpacity, scale: itemsScale }}
            className="absolute -ml-[70px] -mt-[50px] md:-ml-[140px] md:-mt-[90px] text-mat-green"
          >
            <Book className="w-16 h-16 md:w-28 md:h-28 drop-shadow-xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ y: item2Y, x: item2X, rotateZ: item2Rotate, opacity: itemsOpacity, scale: itemsScale }}
            className="absolute ml-[65px] -mt-[70px] md:ml-[130px] md:-mt-[130px] text-mat-green drop-shadow-xl"
          >
            <Pencil className="w-14 h-14 md:w-24 md:h-24" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ y: item3Y, x: item3X, rotateZ: item3Rotate, opacity: itemsOpacity, scale: itemsScale }}
            className="absolute ml-[50px] mt-[55px] md:ml-[90px] md:mt-[110px] text-mat-green drop-shadow-xl"
          >
            <GraduationCap className="w-20 h-20 md:w-32 md:h-32" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ y: item4Y, x: item4X, rotateZ: item4Rotate, opacity: itemsOpacity, scale: itemsScale }}
            className="absolute -ml-[60px] mt-[65px] md:-ml-[110px] md:mt-[120px] text-mat-green drop-shadow-xl"
          >
            <Coffee className="w-14 h-14 md:w-24 md:h-24" />
          </motion.div>
        </div>

        {/* Floating text on the right - Shifted down on mobile to clear coin */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-[68%] md:top-[55%] right-6 md:right-16 lg:right-32 max-w-[85vw] md:max-w-[400px] z-30"
        >
          <p className="text-cream text-base md:text-lg lg:text-2xl font-medium leading-relaxed drop-shadow-md text-right md:text-left">
            Designed to understand, assist, and summarize in all the right ways. Elevate makes the hardest study session feel effortless.
          </p>
        </motion.div>

        {/* Decorative Wooden Pencil (Left Side) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute top-[18%] md:top-[20%] left-[-2%] md:left-[5%] lg:left-[15%] z-20 opacity-100 drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] md:drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]"
          style={{ transformOrigin: 'center center' }}
        >
          <svg viewBox="0 0 40 300" className="h-[200px] md:h-[400px] lg:h-[500px] w-auto -rotate-[45deg] md:-rotate-[45deg]">
            <defs>
              <linearGradient id="pencilWood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e3c39d" />
                <stop offset="20%" stopColor="#d5b084" />
                <stop offset="50%" stopColor="#efd3ae" />
                <stop offset="80%" stopColor="#d5b084" />
                <stop offset="100%" stopColor="#c39d73" />
              </linearGradient>
              <linearGradient id="pencilCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f4e8db" />
                <stop offset="100%" stopColor="#e3c39d" />
              </linearGradient>
            </defs>
            {/* Body */}
            <path d="M10 0 L30 0 L30 230 L10 230 Z" fill="url(#pencilWood)" />
            {/* Cone (Wood part) */}
            <path d="M10 230 L30 230 L23 280 L17 280 Z" fill="url(#pencilCore)" />
            {/* Graphite tip */}
            <path d="M17 280 L23 280 L20 300 Z" fill="#3a3a3a" />
            {/* Eraser Metal */}
            <rect x="10" y="0" width="20" height="15" fill="#a8a29e" />
            {/* Eraser */}
            <path d="M10 0 C 10 -10, 30 -10, 30 0 Z" fill="#fff" opacity="0.8" />
          </svg>
        </motion.div>

        {/* Decorative Paperclips (Bottom Right) - Shifted left on mobile to avoid scroll overlapping */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-[22%] md:bottom-[15%] right-[20%] md:right-[10%] lg:right-[15%] z-10 opacity-60 md:opacity-80 drop-shadow-[0_5px_10px_rgba(0,0,0,0.4)] scale-75 md:scale-100"
        >
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 24 24" className="w-12 h-12 absolute rotate-[15deg] text-[#c0c0c0]" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            <svg viewBox="0 0 24 24" className="w-12 h-12 absolute top-6 left-6 -rotate-[25deg] text-[#e0e0e0]" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </div>
        </motion.div>

        {/* Bottom center scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col md:flex-row items-center gap-2 z-30 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => {
            const el = document.getElementById('features');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="w-6 h-6 md:w-5 md:h-5 rounded-full border border-cream/50 flex items-center justify-center animate-bounce md:animate-none">
            <ChevronDown className="w-4 h-4 md:w-3 md:h-3 text-cream/70" />
          </div>
          <span className="text-cream/70 text-[10px] md:text-[9px] tracking-widest uppercase">Scroll to continue</span>
        </motion.div>

        {/* Vertical pill on the right */}
        <div className="hidden lg:flex absolute top-1/2 right-12 -translate-y-1/2 rotate-90 z-30 items-center gap-4 transform origin-right">
          <div className="w-1.5 h-1.5 rounded-full bg-cream" />
          <span className="text-cream text-xs font-bold tracking-widest uppercase whitespace-nowrap">ELEVATE-1 MODEL</span>
        </div>
      </div>
    </section>
  );
};
