import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { OriginButton } from '../../../components/ui/origin-button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const { scrollY } = useScroll();
  
  const progress = useTransform(scrollY, [0, 80], [0, 1]);

  const navWidth = useTransform(progress, p => `calc(100% - (10% * ${p}))`);
  const navMaxWidth = useTransform(progress, p => `calc(100vw - (100vw - 1000px) * ${p})`);
  
  const navTop = useTransform(progress, p => `${p * 16}px`);
  const navRadius = useTransform(progress, p => `${p * 999}px`);
  
  const navPaddingTop = useTransform(progress, p => `${20 - (8 * p)}px`);
  const navPaddingBottom = useTransform(progress, p => `${20 - (8 * p)}px`);
  
  const navPaddingLeft = useTransform(progress, p => `calc(clamp(20px, 4vw, 40px) - (clamp(4px, 1vw, 16px) * ${p}))`);
  const navPaddingRight = useTransform(progress, p => `calc(clamp(20px, 4vw, 40px) - (clamp(4px, 1vw, 24px) * ${p}))`);
  
  const navShadow = useTransform(progress, [0, 1], ["0px 0px 0px rgba(0,0,0,0)", "0px 20px 40px rgba(0,0,0,0.1)"]);
  const navBackdropFilter = useTransform(progress, p => `blur(${p * 28}px) saturate(${100 + p * 20}%)`);

  const logoScale = useTransform(progress, [0, 1], [1, 0.95]);
  const linkGap = useTransform(progress, p => `${32 - (8 * p)}px`);
  const buttonScale = useTransform(progress, [0, 1], [1, 0.95]);

  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);
  });

  const currentTheme = isScrolled ? 'cream' : 'transparent';

  const bgColors = {
    cream: "rgba(245, 236, 217, 0.45)", // cream with higher glass transparency
    transparent: "rgba(245, 236, 217, 0)"
  };
  
  const borderColors = {
    cream: "rgba(65, 90, 68, 0.15)",
    transparent: "rgba(245, 236, 217, 0)"
  };
  
  const textColors = {
    cream: "#415a44",
    transparent: "#f5ecd9"
  };
  
  const mutedTextColors = {
    cream: "rgba(65, 90, 68, 0.8)",
    transparent: "rgba(245, 236, 217, 0.9)"
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Why Elevate', href: '#why-elevate' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.nav 
        id="main-navbar"
        style={{
          width: navWidth,
          maxWidth: navMaxWidth,
          top: navTop,
          borderRadius: navRadius,
          paddingTop: navPaddingTop,
          paddingBottom: navPaddingBottom,
          paddingLeft: navPaddingLeft,
          paddingRight: navPaddingRight,
          boxShadow: navShadow,
          backdropFilter: navBackdropFilter,
          WebkitBackdropFilter: navBackdropFilter,
        }}
        animate={{
          backgroundColor: bgColors[currentTheme],
          borderColor: borderColors[currentTheme],
        }}
        transition={{ duration: 0.3 }}
        className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between border"
      >
        <div className="flex items-center justify-between w-full relative z-10">
          {/* Logo */}
          <motion.div 
            style={{ scale: logoScale }}
            className="flex items-center gap-2.5 cursor-pointer group/logo origin-left" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/logo.png" alt="Elevate Logo" className="w-8 h-8 rounded-xl object-contain shadow-sm border border-cream/40 bg-cream p-0.5" />
            <motion.span 
              animate={{ color: textColors[currentTheme] }}
              transition={{ duration: 0.3 }}
              className="font-heading font-bold text-xl tracking-tight whitespace-nowrap"
            >
              Elevate
            </motion.span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <motion.div 
              style={{ gap: linkGap }}
              className="flex items-center"
            >
              {navLinks.map((link) => (
                <motion.button 
                  key={link.name} 
                  onClick={() => scrollTo(link.href)}
                  whileHover={{ backgroundColor: isScrolled ? "rgba(65, 90, 68, 0.08)" : "rgba(245, 236, 217, 0.15)", color: isScrolled ? "#415a44" : "#f5ecd9" }}
                  animate={{ color: mutedTextColors[currentTheme], backgroundColor: "rgba(0,0,0,0)" }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                >
                  {link.name}
                </motion.button>
              ))}
            </motion.div>
            
            <motion.div 
              animate={{ borderLeftColor: borderColors[currentTheme] }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 ml-6 pl-6 border-l"
            >
              <motion.button 
                onClick={() => navigate('/auth')}
                whileHover={{ backgroundColor: isScrolled ? "rgba(65, 90, 68, 0.08)" : "rgba(245, 236, 217, 0.15)", color: isScrolled ? "#415a44" : "#f5ecd9" }}
                animate={{ color: textColors[currentTheme], backgroundColor: "rgba(0,0,0,0)" }}
                transition={{ duration: 0.2 }}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
              >
                Log in
              </motion.button>
              <OriginButton 
                style={{ scale: buttonScale as any }}
                onClick={() => navigate('/auth')}
                fillClassName="bg-cork-dark"
                activeTextClassName="text-cream"
                className="px-5 py-2 h-auto rounded-full bg-cork text-cream font-medium text-sm shadow-[0_4px_14px_rgba(208,147,85,0.4)] border border-cork-dark/20 whitespace-nowrap origin-right"
              >
                Get Started
              </OriginButton>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button 
            animate={{ color: textColors[currentTheme] }}
            transition={{ duration: 0.3 }}
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed top-24 left-4 right-4 z-40 bg-mat-green-light/90 backdrop-blur-xl flex flex-col py-4 px-6 border border-cream/10 rounded-3xl mt-2 shadow-2xl pointer-events-auto"
        >
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollTo(link.href)}
              className="text-left text-cream/80 hover:text-cork py-3 text-sm font-medium border-b border-cream/5"
            >
              {link.name}
            </button>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={() => navigate('/auth')}
              className="py-2.5 text-center text-cream/80 hover:text-cork text-sm font-medium"
            >
              Log in
            </button>
            <OriginButton 
              onClick={() => navigate('/auth')}
              fillClassName="bg-cork-dark"
              activeTextClassName="text-cream"
              className="py-2.5 h-auto rounded-full bg-cork text-cream font-medium text-sm shadow-md border border-cork-dark/20"
            >
              Get Started Free
            </OriginButton>
          </div>
        </motion.div>
      )}
    </>
  );
};
