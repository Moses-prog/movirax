"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { ChevronRight, ChevronLeft, Search, Bookmark, Play, Plus, Check } from "lucide-react";

// Step 1: Welcome
const WelcomeSandbox = () => (
  <div className="flex flex-col items-center justify-center text-center h-full gap-6">
    <motion.div 
      animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} 
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="w-32 h-32 bg-gradient-to-br from-danger to-orange-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)]"
    >
      <Play size={64} className="text-white ml-2" fill="currentColor" />
    </motion.div>
    <h3 className="text-3xl font-black">Welcome to Movira X</h3>
    <p className="text-muted-foreground max-w-sm">Click the Next button to begin your interactive platform mastery tour.</p>
  </div>
);

// Step 2: Genres
const GenreSandbox = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="flex gap-2 mb-4 overflow-hidden">
        {["Action", "Comedy", "Sci-Fi", "Horror"].map((g, i) => (
          <Button 
            key={g} 
            size="sm" 
            color={active === i ? "danger" : "default"} 
            variant={active === i ? "solid" : "flat"}
            onPress={() => setActive(i)}
          >
            {g}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <motion.div 
            key={i + active * 10}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="aspect-[2/3] bg-default-200/50 rounded-xl border border-divider flex items-center justify-center relative overflow-hidden"
          >
            <Play size={32} className="text-white/20" />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Step 3: Search
const SearchSandbox = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="w-full max-w-md flex flex-col gap-6 h-full pt-10">
      <Input 
        startContent={<Search size={18} className="text-muted-foreground" />}
        placeholder="Type to search movies..."
        value={query}
        onValueChange={setQuery}
        size="lg"
        classNames={{ inputWrapper: "bg-default-200/50 border border-divider" }}
      />
      <div className="flex flex-col gap-3 flex-1 overflow-hidden">
        <AnimatePresence>
          {query.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-3 rounded-xl bg-default-100/50 border border-divider">
              <div className="w-12 h-16 bg-danger/20 rounded-lg flex shrink-0"></div>
              <div>
                <div className="font-bold">Result for "{query}"</div>
                <div className="text-xs text-muted-foreground">Movie • 2024</div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Try typing something!
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Step 4: Library
const LibrarySandbox = () => {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div 
        animate={saved ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
        className="w-48 aspect-[2/3] bg-default-200/50 rounded-2xl border border-divider relative group overflow-hidden"
      >
        <div className="w-full h-full bg-danger/10"></div>
        <Button 
          isIconOnly 
          color={saved ? "danger" : "default"}
          variant="flat"
          className="absolute top-3 right-3 z-10 backdrop-blur-md bg-black/50"
          onPress={() => setSaved(!saved)}
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </Button>
      </motion.div>
      <div className="text-center">
        <h4 className="font-bold mb-1">Interactive Movie Card</h4>
        <p className="text-sm text-muted-foreground">Click the bookmark icon to save to your library.</p>
      </div>
    </div>
  );
};

// Step 5: Profiles
const ProfilesSandbox = () => {
  const [active, setActive] = useState(0);
  const profiles = [
    { name: "Dad", color: "bg-blue-500" },
    { name: "Mom", color: "bg-danger-500" },
    { name: "Kids", color: "bg-success-500" },
  ];
  return (
    <div className="flex flex-col items-center gap-10">
      <h3 className="text-2xl font-bold">Who is watching?</h3>
      <div className="flex gap-6">
        {profiles.map((p, i) => (
          <div key={p.name} className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => setActive(i)}>
            <motion.div 
              animate={{ scale: active === i ? 1.1 : 1 }}
              className={`w-24 h-24 rounded-2xl ${p.color} border-4 ${active === i ? "border-white" : "border-transparent opacity-50"} transition-all relative flex items-center justify-center`}
            >
              {active === i && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Check size={14} className="text-black" />
                </div>
              )}
            </motion.div>
            <span className={`font-bold ${active === i ? "text-white" : "text-muted-foreground"}`}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Step 6: Support
const SupportSandbox = () => {
  const [messages, setMessages] = useState([
    { sender: "admin", text: "Hi! How can we help you today?" }
  ]);
  const [val, setVal] = useState("");

  const send = () => {
    if(!val) return;
    setMessages(prev => [...prev, { sender: "user", text: val }]);
    setVal("");
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "admin", text: "Our support team usually replies instantly right here in the app!" }]);
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm h-[400px] bg-background/50 backdrop-blur-md rounded-2xl border border-divider flex flex-col overflow-hidden">
      <div className="p-4 border-b border-divider font-bold flex items-center gap-2">
        Live Ticket Support
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`px-3 py-2 rounded-xl max-w-[85%] ${m.sender === "user" ? "bg-danger text-white self-end rounded-br-sm" : "bg-default-200 self-start rounded-bl-sm"}`}
          >
            {m.text}
          </motion.div>
        ))}
      </div>
      <div className="p-3 border-t border-divider flex gap-2">
        <Input 
          size="sm" 
          placeholder="Type a message..." 
          value={val} 
          onValueChange={setVal}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button size="sm" isIconOnly color="danger" onPress={send}><Plus className="rotate-45" size={16}/></Button>
      </div>
    </div>
  );
};

const TOUR_STEPS = [
  {
    title: "Master the Platform",
    desc: (
      <div className="space-y-4">
        <p>Welcome to the ultimate guide to Movira X.</p>
        <p>This isn't a boring wall of text. We've built an interactive simulator to physically show you how to use every powerful feature on this platform.</p>
        <p><strong>Click "Next" to begin the interactive tour.</strong></p>
      </div>
    ),
    component: <WelcomeSandbox />
  },
  {
    title: "Infinite Discovery",
    desc: (
      <div className="space-y-4">
        <p>The homepage is broken down into dozens of hyper-specific genre rows.</p>
        <p>We automatically sort these rows by <strong>popularity and release date</strong>, ensuring you always see the hottest new releases first.</p>
        <p className="text-danger">👉 Try clicking the category tabs on the right to see how instantly the content adapts.</p>
      </div>
    ),
    component: <GenreSandbox />
  },
  {
    title: "Lightning Fast Search",
    desc: (
      <div className="space-y-4">
        <p>Don't want to browse? Use our global search engine to instantly find exactly what you're looking for.</p>
        <p>Search by movie title, TV show, actor, or director, and the results update in real-time as you type.</p>
        <p className="text-danger">👉 Type a letter in the search box to watch it react instantly.</p>
      </div>
    ),
    component: <SearchSandbox />
  },
  {
    title: "Your Personal Vault",
    desc: (
      <div className="space-y-4">
        <p>Never lose track of a recommendation. Build your ultimate personal library using the Watchlist feature.</p>
        <p>We also automatically track your "Continue Watching" progress down to the exact second, so you can resume on any device.</p>
        <p className="text-danger">👉 Click the Bookmark icon on the poster to see how easily you can save content.</p>
      </div>
    ),
    component: <LibrarySandbox />
  },
  {
    title: "Multi-User Profiles",
    desc: (
      <div className="space-y-4">
        <p>Share your account with family without ruining your personalized algorithm.</p>
        <p>Create up to 5 completely isolated profiles. Kids get their own safe space, and your viewing history remains perfectly tailored to you.</p>
        <p className="text-danger">👉 Click an avatar on the right to simulate switching profiles.</p>
      </div>
    ),
    component: <ProfilesSandbox />
  },
  {
    title: "1-Click Live Support",
    desc: (
      <div className="space-y-4">
        <p>We hate waiting on hold just as much as you do.</p>
        <p>If you ever have an issue with billing, streaming, or your account, you can open a live support ticket directly inside the app.</p>
        <p className="text-danger">👉 Type a message in the fake chat window to test our instant support system.</p>
      </div>
    ),
    component: <SupportSandbox />
  }
];

export default function InteractiveTour() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col min-h-[85vh] bg-background pt-8 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center gap-8 z-10">
          {/* Step Indicator */}
          <div className="flex gap-2 items-center">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-500 ${step === i ? "w-12 bg-danger" : "w-4 bg-white/10"}`} 
              />
            ))}
          </div>

          <div className="min-h-[250px] relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{TOUR_STEPS[step].title}</h1>
                <div className="text-lg text-muted-foreground">
                  {TOUR_STEPS[step].desc}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-divider">
            <Button 
              size="lg"
              variant="flat" 
              startContent={<ChevronLeft size={18} />}
              onPress={() => setStep(s => Math.max(0, s - 1))}
              isDisabled={step === 0}
            >
              Back
            </Button>
            {step === TOUR_STEPS.length - 1 ? (
              <Button 
                size="lg"
                color="danger" 
                className="font-bold flex-1"
                as="a"
                href="/discover"
              >
                Start Watching Now
              </Button>
            ) : (
              <Button 
                size="lg"
                color="danger" 
                endContent={<ChevronRight size={18} />}
                onPress={() => setStep(s => Math.min(TOUR_STEPS.length - 1, s + 1))}
                className="font-bold flex-1"
              >
                Next Feature
              </Button>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Sandbox */}
        <div className="w-full lg:w-7/12 min-h-[500px] bg-default-100/30 backdrop-blur-xl rounded-3xl border border-divider flex items-center justify-center p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-danger/5 to-transparent pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="w-full h-full flex items-center justify-center relative z-10"
            >
              {TOUR_STEPS[step].component}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}