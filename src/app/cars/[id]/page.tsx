"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  BarChart3,
  Zap,
  Gauge,
  Timer,
  Cog,
  Weight,
  Hash,
  DollarSign,
  Calendar,
  Share2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import Footer from "@/components/Footer";
import { getCarById, getSimilarCars } from "@/data/cars";
import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";

export default function CarDetailPage() {
  const params = useParams();
  const carId = params.id as string;
  const car = getCarById(carId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();

  if (!car) {
    return (
      <div className="min-h-screen bg-apex-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading font-black text-4xl text-apex-white mb-4">
            CAR NOT FOUND
          </h1>
          <Link
            href="/"
            className="text-apex-accent hover:underline"
          >
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const similarCars = getSimilarCars(car);

  const specs = [
    { icon: Cog, label: "Engine", value: car.specs.engine },
    { icon: Zap, label: "Horsepower", value: `${car.specs.horsepower} HP` },
    { icon: Gauge, label: "Top Speed", value: car.specs.topSpeed },
    { icon: Timer, label: "0-60 MPH", value: car.specs.zeroToSixty },
    { icon: Cog, label: "Torque", value: car.specs.torque },
    { icon: Cog, label: "Transmission", value: car.specs.transmission },
    { icon: Cog, label: "Drivetrain", value: car.specs.drivetrain },
    { icon: Weight, label: "Weight", value: car.specs.weight },
    { icon: Hash, label: "Production", value: car.specs.productionNumbers },
    { icon: DollarSign, label: "MSRP", value: car.specs.msrp },
    { icon: Calendar, label: "Year", value: String(car.year) },
  ];

  return (
    <main className="min-h-screen bg-apex-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={car.heroImage}
            alt={car.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-apex-black via-apex-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-apex-black/60 via-transparent to-apex-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-apex-gray hover:text-apex-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-apex-accent text-xs font-heading font-bold tracking-[0.3em] mb-2 uppercase">
              {car.brand} • {car.category}
            </p>
            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-apex-white mb-4">
              {car.name}
            </h1>
            <p className="text-apex-gray text-base md:text-lg max-w-2xl mb-6">
              {car.description}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mb-6">
              {[
                { label: "HORSEPOWER", value: String(car.specs.horsepower), icon: Zap, color: "text-apex-accent" },
                { label: "TOP SPEED", value: car.specs.topSpeed, icon: Gauge, color: "text-apex-gold" },
                { label: "0-60 MPH", value: car.specs.zeroToSixty, icon: Timer, color: "text-apex-blue" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 glass rounded-lg px-4 py-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className={`font-heading font-bold text-lg ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-apex-gray tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => toggleFavorite(car.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-heading font-bold text-xs tracking-wider transition-all ${
                  isFavorite(car.id)
                    ? "bg-apex-accent text-white"
                    : "border border-white/20 text-apex-gray hover:text-white hover:border-apex-accent/50"
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isFavorite(car.id) ? "currentColor" : "none"}
                />
                {isFavorite(car.id) ? "SAVED" : "SAVE"}
              </button>
              <button
                onClick={() => toggleCompare(car.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-heading font-bold text-xs tracking-wider transition-all ${
                  isInCompare(car.id)
                    ? "bg-apex-blue text-white"
                    : "border border-white/20 text-apex-gray hover:text-white hover:border-apex-blue/50"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {isInCompare(car.id) ? "IN COMPARE" : "COMPARE"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 rounded-sm font-heading font-bold text-xs tracking-wider text-apex-gray hover:text-white hover:border-white/40 transition-all"
              >
                <Share2 className="w-4 h-4" />
                SHARE
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specs Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[2px] bg-apex-accent" />
              <p className="text-xs font-heading font-bold tracking-[0.3em] text-apex-accent">
                SPECIFICATIONS
              </p>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-apex-white">
              PERFORMANCE DATA
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5 flex items-center gap-4 group hover:border-apex-accent/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-apex-accent/10 flex items-center justify-center flex-shrink-0">
                  <spec.icon className="w-5 h-5 text-apex-accent" />
                </div>
                <div>
                  <p className="text-xs text-apex-gray tracking-wider uppercase mb-0.5">
                    {spec.label}
                  </p>
                  <p className="text-sm font-medium text-apex-white">
                    {spec.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-apex-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[2px] bg-apex-gold" />
              <p className="text-xs font-heading font-bold tracking-[0.3em] text-apex-gold">
                GALLERY
              </p>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-apex-white">
              VISUAL SHOWCASE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {car.gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-video rounded-xl overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`${car.name} gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Visualization */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[2px] bg-apex-blue" />
              <p className="text-xs font-heading font-bold tracking-[0.3em] text-apex-blue">
                PERFORMANCE
              </p>
            </div>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-apex-white">
              POWER METRICS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HP Bar */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-apex-gray">Horsepower</span>
                <span className="font-heading font-bold text-apex-accent">
                  {car.specs.horsepower} HP
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min((car.specs.horsepower / 1600) * 100, 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-apex-accent to-red-400"
                />
              </div>
              <p className="text-xs text-apex-gray mt-2">Scale: 0 – 1,600 HP</p>
            </div>

            {/* Top Speed Bar */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-apex-gray">Top Speed</span>
                <span className="font-heading font-bold text-apex-gold">
                  {car.specs.topSpeed}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.min((parseInt(car.specs.topSpeed) / 330) * 100, 100)}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-apex-gold to-yellow-400"
                />
              </div>
              <p className="text-xs text-apex-gray mt-2">Scale: 0 – 330 MPH</p>
            </div>

            {/* 0-60 (inverted - lower is better) */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-apex-gray">0-60 MPH</span>
                <span className="font-heading font-bold text-apex-blue">
                  {car.specs.zeroToSixty}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.max(100 - (parseFloat(car.specs.zeroToSixty) / 10) * 100, 10)}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-apex-blue to-blue-400"
                />
              </div>
              <p className="text-xs text-apex-gray mt-2">
                Scale: 10s – 0s (faster = fuller bar)
              </p>
            </div>

            {/* Weight */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-apex-gray">Weight</span>
                <span className="font-heading font-bold text-emerald-400">
                  {car.specs.weight}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.max(
                      100 -
                        (parseInt(car.specs.weight.replace(/[^0-9]/g, "")) / 5000) * 100,
                      10
                    )}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
              <p className="text-xs text-apex-gray mt-2">
                Scale: 5,000 – 0 lbs (lighter = fuller bar)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {car.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full glass text-xs text-apex-gray"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <section className="py-16 md:py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="font-heading font-black text-3xl md:text-4xl text-apex-white">
                SIMILAR MACHINES
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCars.map((similar, index) => (
                <CarCard
                  key={similar.id}
                  car={similar}
                  index={index}
                  isFavorite={isFavorite(similar.id)}
                  isInCompare={isInCompare(similar.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
