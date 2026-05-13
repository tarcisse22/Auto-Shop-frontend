"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import Footer from "@/components/Footer";
import { getCarById } from "@/data/cars";
import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";
import { Car } from "@/types/car";

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();

  const favoriteCars: Car[] = useMemo(() => {
    return favorites
      .map((id) => getCarById(id))
      .filter(Boolean) as Car[];
  }, [favorites]);

  return (
    <main className="min-h-screen bg-apex-black">
      <Navbar />

      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-apex-gray hover:text-apex-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-black text-3xl md:text-5xl text-apex-white mb-2">
                  FAVORITES
                </h1>
                <p className="text-apex-gray text-sm">
                  {favoriteCars.length} saved vehicle{favoriteCars.length !== 1 ? "s" : ""}
                </p>
              </div>
              {favoriteCars.length > 0 && (
                <button
                  onClick={() => {
                    favorites.forEach((id) => toggleFavorite(id));
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-xs text-apex-gray hover:text-apex-accent hover:border-apex-accent/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </motion.div>

          {favoriteCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {favoriteCars.map((car, index) => (
                <CarCard
                  key={car.id}
                  car={car}
                  index={index}
                  isFavorite={isFavorite(car.id)}
                  isInCompare={isInCompare(car.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-apex-gray/30 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-apex-gray mb-2">
                No favorites yet
              </h3>
              <p className="text-sm text-apex-gray/60 mb-6">
                Save cars you love by clicking the heart icon.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-apex-accent text-white font-heading font-bold text-sm tracking-wider rounded-sm hover:bg-red-700 transition-colors"
              >
                EXPLORE COLLECTION
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
