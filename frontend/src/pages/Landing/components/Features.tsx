import { BookText, BrainCircuit, GraduationCap, LayoutDashboard, Sparkles, MessageSquare } from 'lucide-react';

import { OriginButton } from '../../../components/ui/origin-button';

const features = [
  {
    icon: <BookText className="w-6 h-6" />,
    title: "Instant Summaries",
    description: "Don't have time to read a 50-page paper? Elevate AI extracts the most important concepts instantly."
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "Interactive Quizzes",
    description: "Test your knowledge immediately. We generate smart quizzes based strictly on your uploaded materials."
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Smart Flashcards",
    description: "Memorize faster. Let the AI build customized flashcard decks using spaced repetition techniques."
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Exam Planner",
    description: "Get a personalized study schedule that optimizes your time and ensures you cover everything."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "AI Chat Tutor",
    description: "Ask questions naturally. Your AI tutor explains complex topics just like a real professor would."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "PDF Analysis",
    description: "Upload any document format. We OCR, parse, and understand your content seamlessly."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-32 relative z-20 border-t border-cream/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-cream">
            Study Smarter, Not Harder
          </h2>
          <p className="text-cream/70 text-lg">
            A complete suite of AI-powered tools designed specifically for students to maximize retention and minimize study time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <OriginButton
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              fillClassName="bg-cream"
              activeTextClassName="text-mat-green"
              className="bg-mat-green-light/30 backdrop-blur-md p-8 group cursor-pointer relative overflow-hidden rounded-2xl border border-cream/10 h-auto w-full normal-case tracking-normal text-cream shadow-none"
              contentClassName="flex flex-col items-start text-left w-full h-full"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cork/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-12 h-12 rounded-xl bg-mat-green-light border border-cream/10 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500 group-hover:border-cork/30 text-cork">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">{feature.title}</h3>
              <p className="opacity-70 text-sm leading-relaxed relative z-10 font-medium">
                {feature.description}
              </p>
            </OriginButton>
          ))}
        </div>
      </div>
    </section>
  );
};
