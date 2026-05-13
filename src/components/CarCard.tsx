"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, BarChart3, Zap, Gauge, Timer } from "lucide-react";
import { Car } from "@/types/car";
import { cn } from "@/lib/utils";

interface CarCardProps {
  car: Car;
  index: number;
  isFavorite?: boolean;
  isInCompare?: boolean;
  onToggleFavorite?: (id: string) => void;
  onToggleCompare?: (id: string) => void;
}

export default function CarCard({
  car,
  index,
  isFavorite = false,
  isInCompare = false,
  onToggleFavorite,
  onToggleCompare,
}: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="group relative"
    >
      <div className="relative bg-apex-card rounded-xl overflow-hidden border border-white/5 card-hover shine-effect">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={car.heroImage}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-apex-card via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                "px-2.5 py-1 rounded-sm text-[10px] font-heading font-bold tracking-wider uppercase",
                car.category === "hypercar" && "bg-apex-accent/90 text-white",
                car.category === "german" && "bg-blue-600/90 text-white",
                car.category === "jdm" && "bg-emerald-600/90 text-white",
                car.category === "supercar" && "bg-purple-600/90 text-white",
                car.category === "exotic" && "bg-apex-gold/90 text-black"
              )}
            >
              {car.category}
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(car.id);
                }}
                className={cn(
                  "p-2 rounded-full glass transition-all",
                  isFavorite
                    ? "bg-apex-accent/20 text-apex-accent"
                    : "hover:bg-white/10 text-white"
                )}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            )}
            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleCompare(car.id);
                }}
                className={cn(
                  "p-2 rounded-full glass transition-all",
                  isInCompare
                    ? "bg-apex-blue/20 text-apex-blue"
                    : "hover:bg-white/10 text-white"
                )}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-apex-gray tracking-wider uppercase mb-1">
                {car.brand} • {car.year}
              </p>
              <h3 className="font-heading font-bold text-base md:text-lg text-apex-white group-hover:text-apex-accent transition-colors">
                {car.name}
              </h3>
            </div>
            <p className="text-sm font-heading font-bold text-apex-gold">
              {car.specs.msrp}
            </p>
          </div>

          {/* Quick specs */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-apex-accent" />
              <span className="text-xs text-apex-light font-medium">
                {car.specs.horsepower} HP
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-apex-gold" />
              <span className="text-xs text-apex-light font-medium">
                {car.specs.topSpeed}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-apex-blue" />
              <span className="text-xs text-apex-light font-medium">
                {car.specs.zeroToSixty}
              </span>
            </div>
          </div>

          {/* View button */}
          <Link
            href={`/cars/${car.id}`}
            className="block w-full text-center py-2.5 border border-white/10 rounded-sm text-xs font-heading font-bold tracking-wider text-apex-gray hover:text-apex-white hover:border-apex-accent/50 hover:bg-apex-accent/5 transition-all"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
