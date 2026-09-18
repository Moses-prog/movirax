"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, Card, CardBody, Divider } from "@heroui/react";
import { ChevronRight, ChevronLeft, Search, Bookmark, Play, Plus, Check, Info } from "lucide-react";

// Flat, zero-gradient sandboxes
const WelcomeSandbox = () => (
  <div className="flex flex-col items-center justify-center text-center h-full gap-4">
    <div className="w-24 h-24 bg-danger rounded-2xl flex items-center justify-center">
      <Play size={40} className="text-white ml-2" fill="currentColor" />
    </div>
    <h3 className="text-2xl font-bold mt-4">Platform Guide</h3>
    <p className="text-default-500 text-sm max-w-xs">Use the controls below to navigate through the platform documentation.</p>
  </div>
);

const GenreSandbox = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="flex gap-2 mb-2 overflow-hidden">
        {["Action", "Comedy", "Sci-Fi", "Horror"].map((g, i) => (
          <Button 
            key={g} 
            size="sm" 
            color={active === i ? "danger" : "default"} 
            variant={active === i ? "solid" : "flat"}
            className="rounded-md"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[2/3] bg-default-100 rounded-lg flex flex-col justify-end p-3"
          >
            <div className="h-2 w-1/2 bg-default-300 rounded-full"></div>
          </motion.div>
        ))}
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
        placeholder="Search for titles..."
        value={query}
        onValueChange={setQuery}
        variant="flat"
        radius="sm"
      />
      <div className="flex flex-col gap-2 flex-1">
        <AnimatePresence>
          {query.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-2 rounded-lg bg-default-50">
              <div className="w-10 h-14 bg-default-200 rounded-md shrink-0"></div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">"{query}"</span>
                <span className="text-xs text-default-400">Movie • 2024</span>
              </div>
            </motion.div>
          ) : (
            <div className="text-sm text-default-400 mt-4 text-center">
              Type to see results
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
    <div className="flex flex-col items-center gap-6">
      <div className="w-40 aspect-[2/3] bg-default-100 rounded-lg relative overflow-hidden flex flex-col justify-end p-3">
        <Button 
          isIconOnly 
          color={saved ? "danger" : "default"}
          variant="solid"
          size="sm"
          className="absolute top-2 right-2 rounded-md"
          onPress={() => setSaved(!saved)}
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        </Button>
        <div className="h-2 w-3/4 bg-default-300 rounded-full"></div>
      </div>
      <div className="text-center text-sm text-default-500">
        Click the bookmark to toggle watchlist status.
      </div>
    </div>
  );
};

const ProfilesSandbox = () => {
  const [active, setActive] = useState(0);
  const profiles = [
    { name: "User 1", color: "bg-blue-600" },
    { name: "User 2", color: "bg-danger" },
    { name: "Kids", color: "bg-green-600" },
  ];
  return (
    <div className="flex flex-col items-center gap-8">
      <h3 className="text-lg font-semibold">Select Profile</h3>
      <div className="flex gap-6">
        {profiles.map((p, i) => (
          <div key={p.name} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setActive(i)}>
            <div className={`w-20 h-20 rounded-lg ${p.color} border-2 ${active === i ? "border-foreground" : "border-transparent opacity-50"} flex items-center justify-center`}>
              {active === i && (
                <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                  <Check size={12} className="text-background" />
                </div>
              )}
            </div>
            <span className={`text-sm ${active === i ? "font-semibold text-foreground" : "text-default-500"}`}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SupportSandbox = () => {
  const [messages, setMessages] = useState([
    { sender: "admin", text: "How can we assist you today?" }
  ]);
  const [val, setVal] = useState("");

  const send = () => {
    if(!val) return;
    setMessages(prev => [...prev, { sender: "user", text: val }]);
    setVal("");
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "admin", text: "A support agent will review your request shortly." }]);
    }, 800);
  };

  return (
    <div className="w-full max-w-sm h-[350px] bg-content1 rounded-lg border border-default-200 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-default-200 text-sm font-semibold flex items-center gap-2">
        <Info size={16} className="text-default-500" /> Support Ticket
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`px-3 py-2 rounded-md text-sm max-w-[85%] ${m.sender === "user" ? "bg-danger text-white self-end" : "bg-default-100 text-foreground self-start"}`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-default-200 flex gap-2">
        <Input 
          size="sm" 
          placeholder="Type a message" 
          value={val} 
          onValueChange={setVal}
          variant="flat"
          radius="sm"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button size="sm" isIconOnly color="default" variant="flat" radius="sm" onPress={send}>
          <Plus className="rotate-45" size={16}/>
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
        <p>Use the navigation buttons below to view how each feature works.</p>
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
        <p>You can use the tabs in the demonstration to see how content is filtered.</p>
      </div>
    ),
    component: <GenreSandbox />
  },
  {
    title: "Search",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>Use the search bar to find specific movies, TV shows, actors, or directors.</p>
        <p>The results update automatically as you type, so you don't need to press enter to search.</p>
      </div>
    ),
    component: <SearchSandbox />
  },
  {
    title: "Watchlist and History",
    desc: (
      <div className="space-y-4 text-default-600">
        <p>Click the bookmark icon on any title to add it to your personal watchlist.</p>
        <p>Your progress is saved automatically across devices, allowing you to resume watching from exactly where you left off.</p>
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
      </div>
    ),
    component: <SupportSandbox />
  }
];

export default function InteractiveTour() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Simple, flat header instead of massive animations */}
      <div className="w-full border-b border-divider bg-content1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">About Movira X</h1>
          <p className="text-default-500 mt-2">Platform documentation and user guide.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8 p-6 py-12">
        {/* Left Side: Navigation & Text */}
        <div className="w-full md:w-5/12 flex flex-col gap-6">
          <div className="flex gap-1 mb-4">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-sm transition-all ${step === i ? "w-8 bg-danger" : "w-2 bg-default-200"}`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-2xl font-bold">{TOUR_STEPS[step].title}</h2>
              {TOUR_STEPS[step].desc}
            </motion.div>
          </AnimatePresence>

          <Divider className="my-4" />

          <div className="flex items-center gap-3">
            <Button 
              variant="flat"
              radius="sm"
              onPress={() => setStep(s => Math.max(0, s - 1))}
              isDisabled={step === 0}
            >
              Previous
            </Button>
            {step === TOUR_STEPS.length - 1 ? (
              <Button 
                color="danger" 
                radius="sm"
                className="flex-1"
                as="a"
                href="/discover"
              >
                Go to App
              </Button>
            ) : (
              <Button 
                color="danger"
                radius="sm"
                onPress={() => setStep(s => Math.min(TOUR_STEPS.length - 1, s + 1))}
                className="flex-1"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Right Side: Flat Sandbox */}
        <div className="w-full md:w-7/12 min-h-[450px] bg-content1 border border-default-200 rounded-xl flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center"
            >
              {TOUR_STEPS[step].component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}