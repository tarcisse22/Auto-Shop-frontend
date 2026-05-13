"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import Footer from "@/components/Footer";
import { cars, searchCars } from "@/data/cars";
import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";
import { CategoryType } from "@/types/car";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "hp" | "speed" | "year" | "price">("name");
  const [showFilters, setShowFilters] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();

  const filteredCars = useMemo(() => {
    let results = query.length >= 1 ? searchCars(query) : [...cars];

    if (selectedCategory !== "all") {
      results = results.filter((c) => c.category === selectedCategory);
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "hp":
          return b.specs.horsepower - a.specs.horsepower;
        case "speed":
          return parseInt(b.specs.topSpeed) - parseInt(a.specs.topSpeed);
        case "year":
          return b.year - a.year;
        case "price":
          return (
            parseInt(b.specs.msrp.replace(/[^0-9]/g, "")) -
            parseInt(a.specs.msrp.replace(/[^0-9]/g, ""))
          );
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return results;
  }, [query, selectedCategory, sortBy]);

  const categories: { value: CategoryType | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "hypercar", label: "Hypercars" },
    { value: "german", label: "German" },
    { value: "jdm", label: "JDM" },
    { value: "supercar", label: "Supercars" },
    { value: "exotic", label: "Exotic" },
  ];

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
            <h1 className="font-heading font-black text-3xl md:text-5xl text-apex-white mb-4">
              SEARCH
            </h1>
            <p className="text-apex-gray text-sm md:text-base">
              Find your dream machine from our curated collection.
            </p>
          </motion.div>

          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, brand, engine type..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 pl-12 text-sm text-apex-white placeholder-apex-gray focus:outline-none focus:border-apex-accent/50 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apex-gray" />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-apex-gray hover:text-apex-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 rounded-xl border transition-all ${
                  showFilters
                    ? "border-apex-accent/50 bg-apex-accent/10 text-apex-accent"
                    : "border-white/10 bg-white/5 text-apex-gray hover:text-apex-white"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 glass rounded-xl p-5"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Category filter */}
                  <div>
                    <p className="text-xs text-apex-gray tracking-wider mb-2">
                      CATEGORY
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedCategory === cat.value
                              ? "bg-apex-accent text-white"
                              : "bg-white/5 text-apex-gray hover:text-white"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="text-xs text-apex-gray tracking-wider mb-2">
                      SORT BY
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "name" as const, label: "Name" },
                        { value: "hp" as const, label: "Horsepower" },
                        { value: "speed" as const, label: "Top Speed" },
                        { value: "year" as const, label: "Year" },
                        { value: "price" as const, label: "Price" },
                      ].map((sort) => (
                        <button
                          key={sort.value}
                          onClick={() => setSortBy(sort.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            sortBy === sort.value
                              ? "bg-apex-blue text-white"
                              : "bg-white/5 text-apex-gray hover:text-white"
                          }`}
                        >
                          {sort.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results count */}
          <p className="text-sm text-apex-gray mb-6">
            {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""}{" "}
            found
          </p>

          {/* Results Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCars.map((car, index) => (
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
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-apex-gray/30 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-apex-gray mb-2">
                No vehicles found
              </h3>
              <p className="text-sm text-apex-gray/60">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-apex-black flex items-center justify-center">
          <div className="font-heading text-apex-gray">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
