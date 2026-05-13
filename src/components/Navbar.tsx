"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, BarChart3, Menu, X } from "lucide-react";
import { searchCars } from "@/data/cars";
import { Car } from "@/types/car";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchResults(searchCars(searchQuery).slice(0, 6));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-apex-accent rounded-sm flex items-center justify-center group-hover:shadow-glow transition-shadow duration-300">
              <span className="font-heading font-black text-white text-xs md:text-sm">A</span>
            </div>
            <span className="font-heading font-bold text-sm md:text-lg tracking-[0.2em] text-apex-white">
              APEX<span className="text-apex-accent">MOTORS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#hypercars"
              className="text-sm font-medium text-apex-gray hover:text-apex-white transition-colors tracking-wider"
            >
              HYPERCARS
            </Link>
            <Link
              href="/#german"
              className="text-sm font-medium text-apex-gray hover:text-apex-white transition-colors tracking-wider"
            >
              GERMAN
            </Link>
            <Link
              href="/#jdm"
              className="text-sm font-medium text-apex-gray hover:text-apex-white transition-colors tracking-wider"
            >
              JDM
            </Link>
          </div>

          {/* Search + Icons */}
          <div className="flex items-center gap-3">
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars..."
                  className="w-40 md:w-64 bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-sm text-apex-white placeholder-apex-gray focus:outline-none focus:border-apex-accent/50 focus:bg-white/8 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apex-gray" />
              </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {showSearch && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-2 right-0 w-80 glass-strong rounded-xl overflow-hidden shadow-2xl"
                  >
                    {searchResults.map((car) => (
                      <Link
                        key={car.id}
                        href={`/cars/${car.id}`}
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-apex-card overflow-hidden flex-shrink-0">
                          <img
                            src={car.heroImage}
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-apex-white">
                            {car.name}
                          </p>
                          <p className="text-xs text-apex-gray">
                            {car.specs.horsepower} HP • {car.year}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                      }}
                      className="block px-4 py-3 text-center text-sm text-apex-accent hover:bg-white/5 border-t border-white/5"
                    >
                      View all results →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/favorites"
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5 text-apex-gray hover:text-apex-accent transition-colors" />
            </Link>

            <Link
              href="/compare"
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Compare"
            >
              <BarChart3 className="w-5 h-5 text-apex-gray hover:text-apex-accent transition-colors" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/5"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-apex-white" />
              ) : (
                <Menu className="w-5 h-5 text-apex-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { href: "/#hypercars", label: "HYPERCARS" },
                { href: "/#german", label: "GERMAN PERFORMANCE" },
                { href: "/#jdm", label: "JDM LEGENDS" },
                { href: "/favorites", label: "FAVORITES" },
                { href: "/compare", label: "COMPARE" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-apex-gray hover:text-apex-white transition-colors tracking-wider py-2"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
