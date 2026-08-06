"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is my viewing data private?",
    answer: "Absolutely. We employ enterprise-grade encryption to ensure your watchlists and history remain completely private unless you explicitly choose to share them with friends."
  },
  {
    question: "Can I import my data from Letterboxd or IMDB?",
    answer: "Yes! Movira X Premium allows you to seamlessly import your entire history and watchlists from Letterboxd, IMDB, and Trakt via CSV upload."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Movira X is built as a Progressive Web App (PWA). You can install it directly to your home screen on iOS and Android for a native app experience, offline support included."
  },
  {
    question: "How often is the movie database updated?",
    answer: "Our database syncs with TMDB in real-time, meaning new releases, cast updates, and trending data are always up to the minute."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 lg:px-8 max-w-[800px] mx-auto transition-colors">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4 transition-colors">Frequently Asked Questions</h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">Everything you need to know about the platform.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`bg-white dark:bg-[#121212] border ${isOpen ? 'border-gray-300 dark:border-white/20 shadow-md dark:shadow-none' : 'border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none'} rounded-3xl overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-transparent transition-colors"
              >
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200 transition-colors">{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 ml-4 transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
