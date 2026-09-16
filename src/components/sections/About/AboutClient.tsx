"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Card, CardBody, Button } from "@heroui/react";
import Link from "next/link";
import { 
  PlayCircle, 
  Compass, 
  Users, 
  FolderHeart, 
  CreditCard, 
  LifeBuoy 
} from "lucide-react";
import dynamic from "next/dynamic";
const FAQ = dynamic(() => import("@/components/sections/About/FAQ"));

export default function AboutClient() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex w-full flex-col pb-24 overflow-hidden">
      
      {/* Hero Section */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="relative pt-32 pb-20 px-4 md:pt-48 md:pb-32 flex flex-col items-center justify-center text-center min-h-[60vh]"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-danger-500/20 via-background to-background"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-danger/50 to-transparent"></div>
        
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 text-danger border border-danger/20 mb-6 text-sm font-bold tracking-widest uppercase"
          variants={fadeInUp}
        >
          <PlayCircle size={16} /> Welcome to the Revolution
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-black tracking-tight text-foreground max-w-5xl leading-tight mb-6"
          variants={fadeInUp}
        >
          Entertainment <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Without Limits.</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          variants={fadeInUp}
        >
          One platform. Infinite stories. Completely on your terms. Master the ultimate streaming experience.
        </motion.p>
        
        <motion.div variants={fadeInUp}>
          <Button as={Link} href="/" color="danger" size="lg" className="font-bold px-10 rounded-full">
            Start Exploring
          </Button>
        </motion.div>
      </motion.section>

      {/* Stats Strip */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="w-full max-w-6xl mx-auto px-4 mb-32"
      >
        <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden">
          <CardBody className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-divider">
              <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center p-10 text-center hover:bg-default-100/20 transition-colors">
                <span className="text-5xl font-black text-foreground mb-2">50K+</span>
                <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Hours of Content</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center p-10 text-center hover:bg-default-100/20 transition-colors">
                <span className="text-5xl font-black text-foreground mb-2">100%</span>
                <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Ad-Free Premium</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center p-10 text-center hover:bg-default-100/20 transition-colors">
                <span className="text-5xl font-black text-foreground mb-2">Zero</span>
                <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Commitments</span>
              </motion.div>
            </div>
          </CardBody>
        </Card>
      </motion.section>

      {/* Guide Sections */}
      <div className="w-full max-w-6xl mx-auto px-4 space-y-32 mb-32">
        
        {/* Section 1: Discover */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
        >
          <div className="flex-1 order-2 md:order-1">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Compass size={40} className="text-primary" />
            </div>
            <h2 className="text-4xl font-black mb-4">Finding Your Next Obsession</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Use the <strong>Homepage</strong> for instant, curated recommendations across every genre. If you want to dig deep, head over to the <strong>Discover</strong> page to heavily filter by year, genre, and global ratings.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                <p>Click <strong className="text-foreground">See All</strong> on any row to enter a dedicated, distraction-free grid for that exact category.</p>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                <p>Use the global search bar to instantly find actors, directors, or specific titles.</p>
              </li>
            </ul>
          </div>
          <div className="flex-1 order-1 md:order-2 relative w-full aspect-square md:aspect-video rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1000&auto=format&fit=crop)] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <Compass size={120} className="text-primary/50" />
          </div>
        </motion.div>

        {/* Section 2: Profiles */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
        >
          <div className="flex-1 relative w-full aspect-square md:aspect-video rounded-3xl bg-gradient-to-br from-success/20 to-transparent border border-success/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop)] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <Users size={120} className="text-success/50" />
          </div>
          <div className="flex-1">
            <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mb-6">
              <Users size={40} className="text-success" />
            </div>
            <h2 className="text-4xl font-black mb-4">Made for the Whole Family</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Everyone in your house has different tastes. Create up to 5 dedicated, isolated profiles so your algorithm recommendations stay perfectly tuned to you.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                <p>Choose from dozens of premium avatars to personalize your space.</p>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                <p>Keep viewing histories and watchlists completely separate.</p>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Section 3: Library */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
        >
          <div className="flex-1 order-2 md:order-1">
            <div className="w-20 h-20 rounded-2xl bg-warning/10 flex items-center justify-center mb-6">
              <FolderHeart size={40} className="text-warning" />
            </div>
            <h2 className="text-4xl font-black mb-4">Your Personal Vault</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Never lose track of a recommendation again. Build your ultimate personal library.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-warning shrink-0"></div>
                <p>Click the <strong className="text-foreground">Bookmark</strong> icon on any movie to save it for later.</p>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-warning shrink-0"></div>
                <p>Your <strong>Continue Watching</strong> row automatically remembers exactly where you left off, down to the second.</p>
              </li>
            </ul>
          </div>
          <div className="flex-1 order-1 md:order-2 relative w-full aspect-square md:aspect-video rounded-3xl bg-gradient-to-br from-warning/20 to-transparent border border-warning/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop)] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <FolderHeart size={120} className="text-warning/50" />
          </div>
        </motion.div>

        {/* Section 4: Billing & Support */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
        >
          <div className="flex-1 relative w-full aspect-square md:aspect-video rounded-3xl bg-gradient-to-br from-danger/20 to-transparent border border-danger/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop)] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <LifeBuoy size={120} className="text-danger/50" />
          </div>
          <div className="flex-1">
            <div className="w-20 h-20 rounded-2xl bg-danger/10 flex items-center justify-center mb-6">
              <CreditCard size={40} className="text-danger" />
            </div>
            <h2 className="text-4xl font-black mb-4">Complete Control</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We believe in total transparency. Manage your subscriptions and get help without ever jumping through hoops or waiting on hold.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-danger shrink-0"></div>
                <p>Upgrade, downgrade, or cancel directly from your profile dashboard instantly.</p>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-danger shrink-0"></div>
                <p>Have an issue? Use our <strong>1-Click Support Inbox</strong> to chat directly with our admins. No emails required.</p>
              </li>
            </ul>
          </div>
        </motion.div>

      </div>

      {/* FAQ Section */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
        className="w-full max-w-4xl mx-auto px-4 mb-32"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about Movira X.</p>
        </div>
        <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-xl backdrop-blur-md">
          <CardBody className="p-6 md:p-10">
            <FAQ />
          </CardBody>
        </Card>
      </motion.div>

    </div>
  );
}

