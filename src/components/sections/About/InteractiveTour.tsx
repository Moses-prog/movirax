"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, Chip, Avatar, Tooltip, Divider } from "@heroui/react";
import { ChevronRight, ChevronLeft, Search, Bookmark, Play, Plus, Check, LifeBuoy, Clock, UserCircle, Send, FileText } from "lucide-react";

// Real image placeholders to simulate the actual app UI
const MOVIES = {
  action: [
    { id: 1, title: "Deadpool & Wolverine", img: "https://image.tmdb.org/t/p/w500/i7UyjfPio0VFHB9rBUZSFyhOoM8.jpg" },
    { id: 2, title: "Dune: Part Two", img: "https://image.tmdb.org/t/p/w500/6rpvddXbaQPOi0fB2HKWbZ3uUSg.jpg" },
  ],
  scifi: [
    { id: 3, title: "Interstellar", img: "https://image.tmdb.org/t/p/w500/uxCaBoYXsDC4A0SqTm3SISj0OwK.jpg" },
    { id: 4, title: "The Matrix", img: "https://image.tmdb.org/t/p/w500/sfQtVlIHljToOwYjhe21KPGzZWK.jpg" },
  ]
};

const WelcomeSandbox = () => (
  <div className="flex flex-col items-center justify-center text-center h-full gap-4 w-full">
    <div className="w-full max-w-sm aspect-video bg-default-100 rounded-xl overflow-hidden relative border border-default-200">
      <img src="https://image.tmdb.org/t/p/w1280/1CIaRYKf3zg2Xyce1CSfCMg2Vfw.jpg" className="w-full h-full object-cover opacity-60" alt="Hero" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent flex flex-col justify-end p-6 items-start text-left">
        <h2 className="text-2xl font-black text-white">DUNE</h2>
        <div className="flex gap-2 mt-2">
          <Button size="sm" color="danger" startContent={<Play size={14} fill="currentColor" />}>Play</Button>
          <Button size="sm" variant="flat" isIconOnly><Bookmark size={14} /></Button>
        </div>
      </div>
    </div>
    <p className="text-default-500 text-sm mt-4">Interactive UI Preview</p>
  </div>
);

const GenreSandbox = () => {
  const [active, setActive] = useState<"action" | "scifi">("action");
  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2 overflow-hidden">
          <Button size="sm" color={active === "action" ? "danger" : "default"} variant={active === "action" ? "solid" : "flat"} className="rounded-full" onPress={() => setActive("action")}>Action</Button>
          <Button size="sm" color={active === "scifi" ? "danger" : "default"} variant={active === "scifi" ? "solid" : "flat"} className="rounded-full" onPress={() => setActive("scifi")}>Sci-Fi</Button>
        </div>
        <span className="text-xs font-bold text-default-500 hover:text-foreground cursor-pointer">See All &gt;</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {MOVIES[active].map(movie => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="aspect-[2/3] bg-default-100 rounded-xl flex flex-col justify-end relative overflow-hidden group cursor-pointer border border-default-200"
            >
              <img src={movie.img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={movie.title} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button isIconOnly size="sm" color="danger" variant="solid" className="rounded-full backdrop-blur-md bg-black/50 text-white"><Play size={14} fill="currentColor" /></Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SearchSandbox = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="w-full max-w-md flex flex-col gap-4 h-full pt-10">
      <Input 
        startContent={<Search size={16} className="text-default-400" />}
        placeholder="Search for movies, tv shows, people..."
        value={query}
        onValueChange={setQuery}
        variant="flat"
        radius="full"
        size="lg"
      />
      <div className="flex flex-col gap-2 flex-1 mt-4">
        <AnimatePresence>
          {query.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-2 rounded-xl hover:bg-default-100 cursor-pointer transition-colors border border-transparent hover:border-default-200">
              <img src="https://image.tmdb.org/t/p/w500/cRrf3UIw1HmiFEkKo0Vi85fFjqF.jpg" className="w-12 h-16 rounded-lg object-cover shadow-sm" alt="Oppenheimer" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold">Oppenheimer</span>
                <span className="text-xs text-default-400 font-medium">Movie • 2023 • 8.1/10</span>
              </div>
            </motion.div>
          ) : (
            <div className="text-sm text-default-400 mt-4 text-center flex flex-col items-center gap-2">
              <Search size={24} className="opacity-20" />
              <span>Start typing to search</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const LibrarySandbox = () => {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">
      <div className="w-full aspect-[2/3] bg-default-100 rounded-xl relative overflow-hidden group border border-default-200 shadow-md">
        <img src="https://image.tmdb.org/t/p/w500/uxCaBoYXsDC4A0SqTm3SISj0OwK.jpg" className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Interstellar" />
        
        <Tooltip content={saved ? "Remove from Library" : "Add to Library"} placement="left" color="danger">
          <Button 
            isIconOnly 
            color={saved ? "danger" : "default"}
            variant={saved ? "solid" : "flat"}
            size="sm"
            className="absolute top-3 right-3 rounded-full z-10 backdrop-blur-md bg-black/40 text-white border border-white/10"
            onPress={() => setSaved(!saved)}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          </Button>
        </Tooltip>

        {/* Realistic Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-default-200/50 backdrop-blur-sm">
          <div className="h-full bg-danger w-[65%]"></div>
        </div>
      </div>
      <div className="text-center text-sm text-default-500 font-medium">
        Try clicking the bookmark icon
      </div>
    </div>
  );
};

const ProfilesSandbox = () => {
  const [active, setActive] = useState(0);
  const profiles = [
    { name: "Dad", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=transparent" },
    { name: "Mom", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Aneka&backgroundColor=transparent" },
    { name: "Kids", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Jack&backgroundColor=transparent" },
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full h-full bg-content1 rounded-2xl border border-default-200 shadow-sm p-8">
      <h3 className="text-3xl font-black text-foreground">Who's watching?</h3>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {profiles.map((p, i) => (
          <div key={p.name} className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setActive(i)}>
            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden border-3 transition-all ${active === i ? "border-foreground scale-110" : "border-transparent opacity-70 group-hover:opacity-100 group-hover:border-default-300"}`}>
              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <span className={`text-sm ${active === i ? "font-bold text-foreground" : "text-default-500"}`}>{p.name}</span>
          </div>
        ))}
      </div>
      <Button variant="flat" size="sm" startContent={<Plus size={14} />} className="mt-4 rounded-full font-medium">
        Add Profile
      </Button>
    </div>
  );
};

const SupportSandbox = () => {
  const [messages, setMessages] = useState([
    { sender: "admin", text: "Hello! Our support team is here to help with your billing issue." }
  ]);
  const [val, setVal] = useState("");

  const send = () => {
    if(!val) return;
    setMessages(prev => [...prev, { sender: "user", text: val }]);
    setVal("");
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "admin", text: "An admin will review your ticket and respond here shortly." }]);
    }, 800);
  };

  return (
    <div className="w-full max-w-sm bg-content1 rounded-2xl border border-default-200 flex flex-col overflow-hidden shadow-lg h-[400px]">
      <div className="p-4 border-b border-default-200 flex flex-col gap-2 bg-default-50/50">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-default-500" />
            <span className="font-bold text-sm">Ticket #1042</span>
          </div>
          <Chip color="warning" size="sm" variant="flat" className="font-medium">Open</Chip>
        </div>
        <div className="text-lg font-black leading-tight">Need help upgrading my plan</div>
        <div className="flex items-center gap-2 text-xs text-default-500">
          <Clock size={12} /> Last updated just now
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-background">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <Avatar 
              size="sm" 
              icon={m.sender === "admin" ? <LifeBuoy size={14}/> : <UserCircle size={14}/>} 
              classNames={{ base: m.sender === "admin" ? "bg-danger text-white" : "bg-default-200" }}
            />
            <div className={`px-3 py-2 rounded-2xl text-sm max-w-[75%] ${m.sender === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-default-100 text-foreground rounded-tl-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-default-200 flex gap-2 bg-content1">
        <Input 
          size="sm" 
          placeholder="Reply to ticket..." 
          value={val} 
          onValueChange={setVal}
          variant="flat"
          radius="full"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button size="sm" isIconOnly color="primary" variant="solid" radius="full" onPress={send}>
          <Send size={14} className="-ml-0.5" />
        </Button>
      </div>
    </div>
  );
};

const TOUR_STEPS = [
  {
    title: "Getting Started",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>Movira X is a streaming platform designed for simplicity. This guide explains how to navigate the interface, manage your account, and find content.</p>
        <p>Use the navigation buttons below to view an interactive preview of each core feature.</p>
      </div>
    ),
    component: <WelcomeSandbox />
  },
  {
    title: "Browsing Content",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>The homepage provides curated rows organized by genre and popularity.</p>
        <p>To view a complete list for any category, click "See All" next to the row title.</p>
        <p>Try clicking the category tabs on the right to see the content update instantly.</p>
      </div>
    ),
    component: <GenreSandbox />
  },
  {
    title: "Search",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>Use the search bar to find specific movies, TV shows, actors, or directors.</p>
        <p>The results update automatically as you type, providing an instant preview without needing to press enter.</p>
      </div>
    ),
    component: <SearchSandbox />
  },
  {
    title: "Watchlist and History",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>Click the bookmark icon on any title to add it to your personal watchlist.</p>
        <p>Your progress is saved automatically across devices (indicated by the red progress bar), allowing you to resume watching from exactly where you left off.</p>
      </div>
    ),
    component: <LibrarySandbox />
  },
  {
    title: "Account Profiles",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>You can create multiple profiles under a single account to share with family members.</p>
        <p>Each profile maintains its own separate viewing history, watchlist, and personalized recommendations.</p>
      </div>
    ),
    component: <ProfilesSandbox />
  },
  {
    title: "Help and Support",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>If you need assistance, you can open a support ticket directly from your account settings.</p>
        <p>Support representatives will reply to your ticket within the app, keeping all your inquiries in one place.</p>
        <p>Try typing a reply in the ticket window on the right to test it.</p>
      </div>
    ),
    component: <SupportSandbox />
  }
];

export default function InteractiveTour() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="w-full border-b border-divider bg-content1 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">About Movira X</h1>
            <p className="text-default-500 mt-2">Platform documentation and user guide.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8 p-4 md:p-6 pt-8 pb-24 md:pt-12 md:pb-40">
        {/* Left Side: Navigation & Text */}
        <div className="w-full md:w-5/12 flex flex-col gap-6">
          <div className="flex gap-1 mb-4">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-sm transition-all ${step === i ? "w-8 bg-foreground" : "w-2 bg-default-200"}`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 min-h-[200px]"
            >
              <h2 className="text-3xl font-bold">{TOUR_STEPS[step].title}</h2>
              {TOUR_STEPS[step].desc}
            </motion.div>
          </AnimatePresence>

          <Divider className="my-2" />

          <div className="flex items-center gap-3">
            <Button 
              variant="flat"
              radius="sm"
              onPress={() => setStep(s => Math.max(0, s - 1))}
              isDisabled={step === 0}
            >
              Previous
            </Button>
            <Button 
              color="foreground"
              radius="sm"
              onPress={() => setStep(s => Math.min(TOUR_STEPS.length - 1, s + 1))}
              className="flex-1 font-semibold"
              isDisabled={step === TOUR_STEPS.length - 1}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Right Side: Highly Realistic Flat Sandbox */}
        <div className="w-full md:w-7/12 min-h-[400px] md:min-h-[500px] bg-default-50 border border-default-200 rounded-2xl flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
          {/* Subtle grid pattern for technical documentation vibe */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
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