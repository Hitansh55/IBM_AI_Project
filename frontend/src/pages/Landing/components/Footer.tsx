import { Mail } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-cream border-t border-mat-green/10 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cork/50 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="flex flex-col items-start max-w-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <img src="/logo.png" alt="Elevate Logo" className="w-8 h-8 rounded-xl object-contain shadow-sm border border-cream/40 bg-cream p-0.5" />
              <span className="font-heading font-bold text-xl tracking-tight text-mat-green">Elevate</span>
            </div>
            <p className="text-mat-green/80 font-medium text-sm mb-8 leading-relaxed">
              The intelligent study companion that helps you learn faster, think smarter, and achieve more without the burnout.
            </p>
            <div className="flex gap-4">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hitanshgupta556677@gmail.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-mat-green/5 flex items-center justify-center text-mat-green/70 hover:text-cork hover:bg-mat-green/10 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/hitansh5_5/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-mat-green/5 flex items-center justify-center text-mat-green/70 hover:text-cork hover:bg-mat-green/10 transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-mat-green/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-mat-green/80 font-medium text-sm">
            &copy; {new Date().getFullYear()} Elevate. All rights reserved.
          </p>
          <div className="text-mat-green/80 font-medium text-sm flex items-center gap-1">
            Made with <span className="text-cork">♥</span> for students.
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-mat-green/50 italic">
          * Disclaimer: The testimonials and user profiles shown on this site are simulated and intended for demonstration purposes only.
        </div>
      </div>
    </footer>
  );
};
