"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedStats from "@/components/FeaturedStats";
import CategorySection from "@/components/CategorySection";
import CompareBar from "@/components/CompareBar";
import Footer from "@/components/Footer";
import { getCarsByCategory } from "@/data/cars";
import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";

export default function HomePage() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { compareList, toggleCompare, isInCompare, clearCompare } = useCompare();

  const hypercars = getCarsByCategory("hypercar");
  const germanCars = getCarsByCategory("german");
  const jdmCars = getCarsByCategory("jdm");
  const supercars = getCarsByCategory("supercar");
  const exoticCars = getCarsByCategory("exotic");

  return (
    <main className="min-h-screen bg-apex-black">
      <Navbar />
      <HeroSection />
      <FeaturedStats />

      <CategorySection
        id="hypercars"
        title="HYPERCARS"
        subtitle="BEYOND LIMITS"
        accentColor="#e63946"
        cars={hypercars}
        isFavorite={isFavorite}
        isInCompare={isInCompare}
        onToggleFavorite={toggleFavorite}
        onToggleCompare={toggleCompare}
      />

      <CategorySection
        id="german"
        title="GERMAN PERFORMANCE"
        subtitle="PRECISION ENGINEERING"
        accentColor="#4a9eff"
        cars={germanCars}
        isFavorite={isFavorite}
        isInCompare={isInCompare}
        onToggleFavorite={toggleFavorite}
        onToggleCompare={toggleCompare}
      />

      <CategorySection
        id="jdm"
        title="JDM LEGENDS"
        subtitle="RISING SUN ICONS"
        accentColor="#10b981"
        cars={jdmCars}
        isFavorite={isFavorite}
        isInCompare={isInCompare}
        onToggleFavorite={toggleFavorite}
        onToggleCompare={toggleCompare}
      />

      <CategorySection
        id="supercars"
        title="SUPERCARS"
        subtitle="PURE EXHILARATION"
        accentColor="#8b5cf6"
        cars={supercars}
        isFavorite={isFavorite}
        isInCompare={isInCompare}
        onToggleFavorite={toggleFavorite}
        onToggleCompare={toggleCompare}
      />

      {exoticCars.length > 0 && (
        <CategorySection
          id="exotic"
          title="EXOTIC CLASSICS"
          subtitle="TIMELESS LEGENDS"
          accentColor="#d4a843"
          cars={exoticCars}
          isFavorite={isFavorite}
          isInCompare={isInCompare}
          onToggleFavorite={toggleFavorite}
          onToggleCompare={toggleCompare}
        />
      )}

      <Footer />
      <CompareBar
        compareList={compareList}
        onRemove={toggleCompare}
        onClear={clearCompare}
      />
    </main>
  );
}
