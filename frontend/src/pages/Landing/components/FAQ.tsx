import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does Elevate AI differ from ChatGPT?",
    answer: "Elevate AI is specifically trained on educational data and operates strictly on the documents you upload. It won't hallucinate outside facts, ensuring your study material is 100% based on your syllabus."
  },
  {
    question: "Can I upload handwritten notes?",
    answer: "Yes! Our OCR technology can read and transcribe clear handwritten notes, converting them into searchable, summariable text."
  },
  {
    question: "What file formats are supported?",
    answer: "We support PDF, DOCX, TXT, PPTX, and common image formats (PNG, JPG) for OCR."
  },
  {
    question: "Is there a limit to how much I can upload?",
    answer: "The Free plan allows 3 documents per month. Pro users enjoy unlimited uploads up to 100MB per file."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative bg-mat-green">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-cream">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-mat-green-light/30 backdrop-blur-md rounded-2xl border border-cream/10 overflow-hidden transition-colors hover:bg-mat-green-light/40"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-lg text-cream">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-cork transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-cream/70 font-medium leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
