"use client";

import { motion } from "framer-motion";
import { ChevronDown, Zap, Gauge, Timer } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-apex-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
      </div>

      {/* Ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-apex-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-apex-accent text-xs md:text-sm font-medium tracking-[0.3em] mb-4 md:mb-6"
          >
            ELITE PERFORMANCE COLLECTION
          </motion.p>

          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-apex-white mb-4 md:mb-6 leading-none">
            <span className="block">WHERE POWER</span>
            <span className="block text-gradient">MEETS PRESTIGE</span>
          </h1>

          <p className="text-apex-gray text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            Explore the world&apos;s most exclusive hypercars, supercars, and
            performance legends. From track-bred machines to street-legal
            masterpieces.
          </p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8 md:mb-12"
          >
            {[
              { icon: Zap, value: "1,600", label: "MAX HP", color: "text-apex-accent" },
              { icon: Gauge, value: "330", label: "TOP MPH", color: "text-apex-gold" },
              { icon: Timer, value: "2.3", label: "0-60 SEC", color: "text-apex-blue" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                <div className="text-left">
                  <p className={`font-heading font-bold text-xl md:text-2xl ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-apex-gray tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/#hypercars"
              className="px-8 py-3.5 bg-apex-accent text-white font-heading font-bold text-sm tracking-wider rounded-sm hover:bg-red-700 transition-all hover:shadow-glow"
            >
              EXPLORE COLLECTION
            </Link>
            <Link
              href="/search?q="
              className="px-8 py-3.5 border border-white/20 text-apex-white font-heading font-bold text-sm tracking-wider rounded-sm hover:bg-white/5 transition-all"
            >
              BROWSE ALL CARS
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-apex-gray" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
