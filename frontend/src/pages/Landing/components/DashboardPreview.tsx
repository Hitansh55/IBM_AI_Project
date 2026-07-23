import { motion } from 'framer-motion';

export const DashboardPreview = () => {
  return (
    <section className="py-32 relative bg-mat-green overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-cream">
            A Workspace That Thinks
          </h2>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto font-medium">
            Experience a seamless, intuitive dashboard where your notes and our AI work together.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto rounded-xl shadow-[0_0_100px_rgba(208,147,85,0.15)] ring-1 ring-cream/10 overflow-hidden"
        >
          {/* Mac window header */}
          <div className="w-full h-10 bg-mat-green-light flex items-center px-4 gap-2 border-b border-cream/10">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          
          {/* App Body */}
          <div className="bg-mat-green flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-cream/10 p-4 flex flex-col gap-4">
              <div className="h-8 w-3/4 bg-cream/10 rounded" />
              <div className="h-4 w-1/2 bg-cream/5 rounded mt-4" />
              <div className="h-4 w-2/3 bg-cream/5 rounded" />
              <div className="h-4 w-1/2 bg-cream/5 rounded" />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-8 flex flex-col relative overflow-hidden">
              <div className="h-10 w-1/3 bg-cream/10 rounded mb-8" />
              
              <div className="flex gap-6 h-full">
                <div className="flex-1 bg-cream/5 border border-cream/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                   <div className="h-6 w-1/4 bg-cream/10 rounded mb-6" />
                   <div className="space-y-3">
                     <div className="h-4 w-full bg-cream/5 rounded" />
                     <div className="h-4 w-full bg-cream/5 rounded" />
                     <div className="h-4 w-4/5 bg-cream/5 rounded" />
                     <div className="h-4 w-full bg-cream/5 rounded" />
                     <div className="h-4 w-2/3 bg-cream/5 rounded" />
                   </div>
                </div>

                <div className="w-80 bg-cream/5 border border-cream/10 rounded-2xl p-6 flex flex-col backdrop-blur-sm">
                  <div className="text-sm font-medium text-cream mb-4">Elevate AI Tutor</div>
                  <div className="flex-1 flex flex-col gap-4">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-cream/10 p-3 rounded-lg text-xs text-cream/70 self-start max-w-[80%]"
                    >
                      I analyzed your notes. Want me to generate a 10-question quiz?
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="bg-cork p-3 rounded-lg text-xs text-white self-end max-w-[80%]"
                    >
                      Yes, focus on chapter 4.
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.5 }}
                      className="border border-cream/10 p-4 rounded-lg mt-auto"
                    >
                      <div className="text-xs text-cream mb-2 font-medium">Generating Quiz...</div>
                      <div className="w-full h-1.5 bg-cream/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ delay: 2.5, duration: 2 }}
                          className="h-full bg-cork"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
