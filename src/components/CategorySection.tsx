"use client";

import { motion } from "framer-motion";
import { Car } from "@/types/car";
import CarCard from "./CarCard";

interface CategorySectionProps {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  cars: Car[];
  isFavorite: (id: string) => boolean;
  isInCompare: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
}

export default function CategorySection({
  id,
  title,
  subtitle,
  accentColor,
  cars,
  isFavorite,
  isInCompare,
  onToggleFavorite,
  onToggleCompare,
}: CategorySectionProps) {
  return (
    <section id={id} className="py-16 md:py-24 relative">
      {/* Ambient background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-5"
        style={{ backgroundColor: accentColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-[2px]"
              style={{ backgroundColor: accentColor }}
            />
            <p
              className="text-xs font-heading font-bold tracking-[0.3em] uppercase"
              style={{ color: accentColor }}
            >
              {subtitle}
            </p>
          </div>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-apex-white">
            {title}
          </h2>
        </motion.div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cars.map((car, index) => (
            <CarCard
              key={car.id}
              car={car}
              index={index}
              isFavorite={isFavorite(car.id)}
              isInCompare={isInCompare(car.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
