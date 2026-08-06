import { FaGithub } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { NextPage } from "next";
const FAQ = dynamic(() => import("@/components/sections/About/FAQ"));

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
};

const AboutPage: NextPage = () => {
  return (
    <div className="flex w-full justify-center px-4 py-12 md:py-20">
      <div className="flex w-full max-w-4xl flex-col gap-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
            About Movira X
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your ultimate premium streaming destination. Enjoy a massive library of blockbuster movies and hit TV shows, beautifully crafted for every screen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <h3 className="text-2xl font-bold mb-2">Unlimited</h3>
            <p className="text-muted-foreground">Endless entertainment with zero ads on our Pro plans.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <h3 className="text-2xl font-bold mb-2">Everywhere</h3>
            <p className="text-muted-foreground">Stream seamlessly on your TV, phone, tablet, or laptop.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <h3 className="text-2xl font-bold mb-2">For Everyone</h3>
            <p className="text-muted-foreground">Share with family using multiple customizable profiles.</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Suspense>
            <FAQ />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
