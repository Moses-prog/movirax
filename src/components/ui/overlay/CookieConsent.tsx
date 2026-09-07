"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasConsent = Cookies.get("movirax_cookie_consent");
    if (!hasConsent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set("movirax_cookie_consent", "true", { expires: 365 });
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-sm text-zinc-300">
              <span className="font-semibold text-white">We value your privacy.</span> We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies as outlined in our <a href="/cookies" className="text-red-500 hover:underline">Cookie Policy</a>.
            </div>
            <div className="flex shrink-0 gap-3">
              <button 
                onClick={() => setShow(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Decline
              </button>
              <button 
                onClick={acceptCookies}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}