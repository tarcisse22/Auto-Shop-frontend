"use client";

import { useState, useCallback } from "react";

const MAX_COMPARE = 3;

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>([]);

  const toggleCompare = useCallback((carId: string) => {
    setCompareList((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, carId];
    });
  }, []);

  const isInCompare = useCallback(
    (carId: string) => compareList.includes(carId),
    [compareList]
  );

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  return { compareList, toggleCompare, isInCompare, clearCompare };
}
