import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for testing the waters.",
    features: [
      "3 Document Uploads per month",
      "Basic AI Summaries",
      "Standard Quiz Generation",
      "Community Support"
    ],
    buttonText: "Start Free",
    popular: false
  },
  {
    name: "Pro Student",
    price: "$9.99",
    period: "/mo",
    description: "Everything you need to ace your exams.",
    features: [
      "Unlimited Document Uploads",
      "Advanced AI Tutors",
      "Smart Spaced Repetition",
      "Export to Anki / Notion",
      "Priority Support"
    ],
    buttonText: "Get Pro",
    popular: true
  }
];

export const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-32 relative bg-cream border-t border-mat-green/5 text-mat-green">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-mat-green-light font-medium text-lg max-w-2xl mx-auto">
            Invest in your education. Less than the cost of a textbook.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className={`relative bg-mat-green/5 border border-mat-green/10 rounded-2xl p-8 flex flex-col ${
                plan.popular ? 'border-cork/50 shadow-[0_0_40px_rgba(208,147,85,0.15)] bg-mat-green/10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cork rounded-full text-xs font-bold text-cream uppercase tracking-wider shadow-md border border-cork-dark/20">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-mat-green-light font-medium text-sm mb-6">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold font-heading">{plan.price}</span>
                {plan.period && <span className="text-mat-green-light font-medium">{plan.period}</span>}
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cork/20 flex items-center justify-center shrink-0 border border-cork/30">
                      <Check className="w-3 h-3 text-cork-dark" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/auth')}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-cork text-cream hover:bg-cork-dark shadow-md hover:shadow-lg hover:-translate-y-0.5' 
                    : 'bg-mat-green/5 text-mat-green hover:bg-mat-green/10 border border-mat-green/20'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
