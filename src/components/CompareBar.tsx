"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, BarChart3 } from "lucide-react";
import { getCarById } from "@/data/cars";

interface CompareBarProps {
  compareList: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function CompareBar({
  compareList,
  onRemove,
  onClear,
}: CompareBarProps) {
  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-5 h-5 text-apex-blue" />
            <div className="flex items-center gap-3">
              {compareList.map((id) => {
                const car = getCarById(id);
                if (!car) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5"
                  >
                    <span className="text-xs text-apex-light">{car.name}</span>
                    <button
                      onClick={() => onRemove(id)}
                      className="text-apex-gray hover:text-apex-accent"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              <span className="text-xs text-apex-gray">
                {compareList.length}/3
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="text-xs text-apex-gray hover:text-apex-white transition-colors"
            >
              Clear
            </button>
            {compareList.length >= 2 && (
              <Link
                href={`/compare?cars=${compareList.join(",")}`}
                className="px-4 py-2 bg-apex-accent text-white text-xs font-heading font-bold tracking-wider rounded-sm hover:bg-red-700 transition-colors"
              >
                COMPARE NOW
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
