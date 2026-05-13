"use client";

import { motion } from "framer-motion";
import { Trophy, Car, Globe, Flame } from "lucide-react";

const stats = [
  { icon: Car, value: "30+", label: "Elite Vehicles", color: "text-apex-accent" },
  { icon: Trophy, value: "12+", label: "World Records", color: "text-apex-gold" },
  { icon: Globe, value: "10+", label: "Iconic Brands", color: "text-apex-blue" },
  { icon: Flame, value: "1,600", label: "Peak Horsepower", color: "text-orange-500" },
];

export default function FeaturedStats() {
  return (
    <section className="py-16 md:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-apex-black via-apex-dark to-apex-black" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="text-center glass rounded-xl p-6 md:p-8"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <p className={`font-heading font-black text-2xl md:text-3xl mb-1 ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-apex-gray tracking-wider uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
