import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I used to spend 4 hours summarizing my lecture notes. With Elevate AI, it takes 30 seconds. This is the ultimate student hack.",
    name: "Sarah Jenkins",
    role: "Pre-Med Student, UCLA",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    quote: "The smart flashcards helped me ace my Bar Exam prep. It knows exactly what I'm likely to forget and tests me on it.",
    name: "Michael Chen",
    role: "Law Student, Harvard",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "Finally, an AI tool that doesn't just give answers, but actually helps you understand the core concepts. It's like having a 24/7 tutor.",
    name: "Elena Rodriguez",
    role: "Computer Science, MIT",
    image: "https://i.pravatar.cc/150?img=5"
  }
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 relative bg-mat-green">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-cream">
            Loved by top students
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="bg-mat-green-light/30 backdrop-blur-md border border-cream/10 rounded-2xl p-8 flex flex-col justify-between"
            >
              <div className="text-lg text-cream mb-8 leading-relaxed font-medium">"{t.quote}"</div>
              <div className="flex items-center gap-4">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full object-cover border border-cream/20 shadow-sm"
                />
                <div>
                  <div className="font-bold text-cream">{t.name}</div>
                  <div className="text-sm text-cream/70">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
