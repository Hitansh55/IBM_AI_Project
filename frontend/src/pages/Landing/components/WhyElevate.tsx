import { motion } from 'framer-motion';
import { Target, Zap, Clock, ShieldCheck } from 'lucide-react';

const reasons = [
  {
    icon: <Target className="w-5 h-5 text-mat-green group-hover:text-cream transition-colors duration-300" />,
    title: "Personalized Learning",
    description: "Our AI adapts to your learning pace and style, focusing on your weak areas."
  },
  {
    icon: <Zap className="w-5 h-5 text-mat-green group-hover:text-cream transition-colors duration-300" />,
    title: "Instant Doubt Solving",
    description: "Get answers to your questions in seconds, backed by your uploaded materials."
  },
  {
    icon: <Clock className="w-5 h-5 text-mat-green group-hover:text-cream transition-colors duration-300" />,
    title: "Study Analytics",
    description: "Track your progress and see how much time you've saved using AI."
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-mat-green group-hover:text-cream transition-colors duration-300" />,
    title: "Smart Revision",
    description: "Automatically schedules topics for review right before you're about to forget them."
  }
];

export const WhyElevate = () => {
  return (
    <section id="why-elevate" className="py-32 relative bg-cream border-y border-mat-green/5 overflow-hidden text-mat-green">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading leading-[1.2] mb-6">
              Why top students choose <span className="text-cork-dark">Elevate AI</span>
            </h2>
            <p className="text-mat-green-light text-lg mb-10 leading-relaxed font-medium">
              We aren't just another ChatGPT wrapper. Elevate AI is purpose-built for education, giving you the exact tools you need to excel in your academics without the fluff.
            </p>

            <div className="space-y-8">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex gap-4 items-start group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-mat-green/5 border border-mat-green/10 flex items-center justify-center shrink-0 group-hover:bg-cork group-hover:border-cork transition-colors duration-300">
                    {reason.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-cork-dark transition-colors duration-300">
                      {reason.title}
                    </h4>
                    <p className="text-mat-green-light text-sm leading-relaxed font-medium">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[600px] w-full rounded-3xl border border-mat-green/10 bg-mat-green/5 p-8 flex flex-col justify-center overflow-hidden shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cork/10 to-transparent" />
            
            {/* Animated Graph Illustration */}
            <div className="relative z-10 w-full aspect-square max-h-[400px] mx-auto">
              <motion.div 
                className="absolute bottom-10 left-10 w-32 h-48 rounded-xl bg-mat-green border border-mat-green-light shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute top-20 right-10 w-40 h-32 rounded-xl bg-cork/20 border border-cork/30 backdrop-blur-md"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cork/40 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cork/20 blur-3xl rounded-full"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-cream/80 backdrop-blur-sm p-4 rounded-full shadow-lg border border-mat-green/10">
                <div className="text-4xl font-bold text-mat-green mb-1">98%</div>
                <div className="text-xs text-mat-green-light font-bold uppercase tracking-wider">Avg. Score</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
