"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    text: "I cancelled three streaming subscriptions after finding this. Everything is here and it actually works.",
    name: "Daniel K.",
    handle: "@dkfilm",
    stars: 5,
  },
  {
    text: "The UI is cleaner than most paid apps. Dark mode is chef's kiss. My go-to for movie nights now.",
    name: "Amara T.",
    handle: "@amarawatches",
    stars: 5,
  },
  {
    text: "16 servers means something is always working. Haven't had a dead link in weeks.",
    name: "Chris R.",
    handle: "@chrisr_dev",
    stars: 5,
  },
  {
    text: "Installed as a PWA on my phone and it feels like a native app. Crazy smooth for a web app.",
    name: "Priya M.",
    handle: "@priyamov",
    stars: 4,
  },
  {
    text: "Watch history syncing across devices is underrated. I started a movie on my laptop and finished on my phone.",
    name: "Jordan L.",
    handle: "@jordanl",
    stars: 5,
  },
  {
    text: "No ads, no popups, no sketchy redirects. Just click and watch. How is this free?",
    name: "Sofia N.",
    handle: "@sofianx",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const duplicated = [...reviews, ...reviews];

  return (
    <section className="py-24 overflow-hidden border-y border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="mb-12 text-center px-4">
        <div className="inline-flex items-center space-x-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Reviews</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
          Real users. Real opinions.
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          See what people are saying after making the switch.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent dark:from-[#0a0a0a] dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent dark:from-[#0a0a0a] dark:to-transparent z-10 pointer-events-none" />

        <div className="marquee-track gap-6 px-6">
          {duplicated.map((review, i) => (
            <div
              key={i}
              className="w-[380px] flex-shrink-0 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm dark:shadow-none cursor-default"
            >
              <div className="flex space-x-1 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s < review.stars ? "text-red-500 fill-red-500" : "text-gray-300 dark:text-gray-700"}`}
                  />
                ))}
              </div>

              <p className="text-base text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center space-x-3">
                <img
                  src={`https://api.dicebear.com/9.x/notionists/svg?seed=${review.handle}`}
                  alt={review.name}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}