import { motion } from 'framer-motion';

const stats = [
  { value: '1.2M+', label: 'Notes Summarized' },
  { value: '500K+', label: 'Quizzes Generated' },
  { value: '2.5M+', label: 'Hours Saved' },
  { value: '4.9/5', label: 'Average Rating' },
];

export const Statistics = () => {
  return (
    <section className="py-20 bg-cream border-y border-mat-green/5 relative overflow-hidden text-mat-green">
      <div className="absolute inset-0 bg-gradient-to-r from-cork/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
            >
              <div className="text-4xl md:text-5xl font-bold font-heading mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-mat-green-light font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
